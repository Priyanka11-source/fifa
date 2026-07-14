import type { OperationalStateSnapshot } from "./operationsState";

export type LanguageCode = "en" | "es" | "fr" | "pt" | "ja" | "ar";
export type ConciergeCategory =
  | "navigation"
  | "accessibility"
  | "transportation"
  | "ticketing"
  | "general";

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  ja: "Japanese",
  ar: "Arabic",
};

const LANGUAGE_MARKERS: Record<Exclude<LanguageCode, "ja" | "ar">, string[]> = {
  en: ["where", "is", "the", "gate", "section", "please", "thanks", "how", "ticket"],
  es: ["dónde", "donde", "está", "esta", "puerta", "sección", "gracias", "por favor", "más rápida", "boleto", "entrada"],
  fr: ["où", "est", "porte", "section", "merci", "s'il vous plaît", "billet", "rapide"],
  pt: ["onde", "está", "esta", "portão", "seção", "obrigado", "ingresso", "bilhete", "rápida"],
};

function normalize(message: string): string {
  return message.toLowerCase();
}

export function detectLanguage(message: string): { code: LanguageCode; name: string } {
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(message)) {
    return { code: "ja", name: LANGUAGE_NAMES.ja };
  }
  if (/[\u0600-\u06ff]/.test(message)) {
    return { code: "ar", name: LANGUAGE_NAMES.ar };
  }

  const normalized = normalize(message);
  const scores: Record<Exclude<LanguageCode, "ja" | "ar">, number> = {
    en: 0,
    es: 0,
    fr: 0,
    pt: 0,
  };

  for (const [code, markers] of Object.entries(LANGUAGE_MARKERS) as [
    Exclude<LanguageCode, "ja" | "ar">,
    string[],
  ][]) {
    for (const marker of markers) {
      if (normalized.includes(marker)) {
        scores[code] += 1;
      }
    }
  }

  // Accent-based tie-breakers make the heuristic much more reliable.
  if (/[ñ¿¡]/.test(normalized)) scores.es += 2;
  if (/[àâçèéêëîïôùûœ]/.test(normalized)) scores.fr += 2;
  if (/[ãõç]/.test(normalized)) scores.pt += 2;

  let best: Exclude<LanguageCode, "ja" | "ar"> = "en";
  let bestScore = 0;
  for (const code of Object.keys(scores) as (typeof best)[]) {
    if (scores[code] > bestScore) {
      bestScore = scores[code];
      best = code;
    }
  }

  return { code: best, name: LANGUAGE_NAMES[best] };
}

const CATEGORY_KEYWORDS: Record<ConciergeCategory, string[]> = {
  navigation: [
    "gate", "entrance", "section", "seat", "where is", "way to",
    "puerta", "entrada", "sección", "asiento", "dónde", "donde",
    "porte", "où", "billete de entrada", "assento",
    "portão", "seção", "onde",
    "ゲート", "入口", "席", "どこ",
    "بوابة", "مدخل", "مقعد", "أين",
  ],
  accessibility: [
    "wheelchair", "accessible", "disability", "ramp",
    "silla de ruedas", "accesible", "discapacidad", "rampa",
    "fauteuil roulant", "handicap", "rampe",
    "cadeira de rodas", "acessível", "deficiência",
    "車椅子", "バリアフリー", "障害",
    "كرسي متحرك", "إعاقة",
  ],
  transportation: [
    "shuttle", "metro", "train", "parking", "bus", "ride",
    "autobús", "autobus", "metro", "tren", "estacionamiento", "transporte",
    "navette", "métro", "parking",
    "ônibus", "onibus", "metrô", "trem", "estacionamento",
    "シャトル", "電車", "駐車場", "バス",
    "حافلة", "مترو", "وقوف السيارات",
  ],
  ticketing: [
    "ticket", "qr", "lost", "refund",
    "boleto", "perdido", "reembolso",
    "billet", "perdu", "remboursement",
    "bilhete", "ingresso", "perdido", "reembolso",
    "チケット", "紛失", "払い戻し",
    "تذكرة", "فقدت", "استرداد",
  ],
  general: [],
};

export function detectCategory(message: string): ConciergeCategory {
  const normalized = normalize(message);
  for (const category of ["accessibility", "transportation", "ticketing", "navigation"] as const) {
    if (CATEGORY_KEYWORDS[category].some((kw) => normalized.includes(kw))) {
      return category;
    }
  }
  return "general";
}

const TRANSLATED_MESSAGE_SUMMARY: Record<ConciergeCategory, string> = {
  navigation: "Fan is asking for directions to a gate, section, or seat.",
  accessibility: "Fan is asking about wheelchair access or accessibility accommodations.",
  transportation: "Fan is asking about shuttle, metro, or parking options.",
  ticketing: "Fan is asking about a ticket, QR code, or refund issue.",
  general: "Fan sent a general greeting or open-ended question.",
};

function quietestGate(state: OperationalStateSnapshot) {
  return [...state.gates].sort((a, b) => a.crowdPct - b.crowdPct)[0];
}

function busiestGate(state: OperationalStateSnapshot) {
  return [...state.gates].sort((a, b) => b.crowdPct - a.crowdPct)[0];
}

function bestTransportLine(state: OperationalStateSnapshot) {
  return [...state.transport].sort((a, b) => a.etaMinutes - b.etaMinutes)[0];
}

function accessibleGate(state: OperationalStateSnapshot) {
  return state.gates.find((g) => g.id === "gate-12") ?? state.gates[0];
}

interface ReplyPair {
  reply: string;
  replyTranslation: string;
}

function buildEnglishReply(category: ConciergeCategory, state: OperationalStateSnapshot): string {
  switch (category) {
    case "navigation": {
      const gate = quietestGate(state);
      const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
      return `${gate.name} has the shortest wait right now (about ${waitMin} min, ${gate.crowdPct}% capacity). I've routed the fastest path to your ticket.`;
    }
    case "accessibility": {
      const gate = accessibleGate(state);
      return `${gate.name} is fully step-free with lift access and currently at ${gate.crowdPct}% capacity. A staff member can meet you there if you need an escort.`;
    }
    case "transportation": {
      const line = bestTransportLine(state);
      return `${line.name} is your fastest option right now — ${line.etaMinutes} min ETA and running ${line.status}. I can send live updates to your phone.`;
    }
    case "ticketing": {
      const gate = busiestGate(state);
      return `I can reissue your ticket instantly in the app. If you'd rather do it in person, the kiosk near ${gate.name} can help, though it's busier (${gate.crowdPct}% capacity).`;
    }
    case "general":
    default:
      return `Welcome to the stadium! I can help with gates and directions, accessible routes, shuttles and parking, or ticket issues — just ask.`;
  }
}

const REPLY_BUILDERS: Partial<
  Record<Exclude<LanguageCode, "en">, (category: ConciergeCategory, state: OperationalStateSnapshot) => string>
> = {
  es: (category, state) => {
    switch (category) {
      case "navigation": {
        const gate = quietestGate(state);
        const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
        return `${gate.name} tiene el menor tiempo de espera actualmente (unos ${waitMin} min, ${gate.crowdPct}% de aforo). He enviado la ruta más rápida a su boleto.`;
      }
      case "accessibility": {
        const gate = accessibleGate(state);
        return `${gate.name} no tiene escalones, cuenta con ascensor y está al ${gate.crowdPct}% de aforo. Un miembro del personal puede acompañarle si lo necesita.`;
      }
      case "transportation": {
        const line = bestTransportLine(state);
        return `${line.name} es su opción más rápida ahora mismo: ${line.etaMinutes} min de espera y funcionando con estado "${line.status}". Puedo enviarle actualizaciones en vivo.`;
      }
      case "ticketing": {
        const gate = busiestGate(state);
        return `Puedo reemitir su boleto al instante desde la app. Si prefiere hacerlo en persona, el mostrador cerca de ${gate.name} puede ayudarle, aunque está más concurrido (${gate.crowdPct}%).`;
      }
      default:
        return `¡Bienvenido al estadio! Puedo ayudarle con puertas y direcciones, rutas accesibles, transporte y estacionamiento, o problemas con su boleto — solo pregunte.`;
    }
  },
  fr: (category, state) => {
    switch (category) {
      case "navigation": {
        const gate = quietestGate(state);
        const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
        return `${gate.name} a actuellement le temps d'attente le plus court (environ ${waitMin} min, ${gate.crowdPct}% d'affluence). J'ai envoyé l'itinéraire le plus rapide vers votre billet.`;
      }
      case "accessibility": {
        const gate = accessibleGate(state);
        return `${gate.name} est entièrement sans marches, avec ascenseur, et se trouve actuellement à ${gate.crowdPct}% d'affluence. Un membre du personnel peut vous accompagner si besoin.`;
      }
      case "transportation": {
        const line = bestTransportLine(state);
        return `${line.name} est votre option la plus rapide en ce moment — ${line.etaMinutes} min d'attente, statut "${line.status}". Je peux vous envoyer des mises à jour en direct.`;
      }
      case "ticketing": {
        const gate = busiestGate(state);
        return `Je peux réémettre votre billet instantanément dans l'application. Sinon, le kiosque près de ${gate.name} peut vous aider, bien qu'il soit plus fréquenté (${gate.crowdPct}%).`;
      }
      default:
        return `Bienvenue au stade ! Je peux vous aider avec les portes et directions, les itinéraires accessibles, les navettes et le stationnement, ou les problèmes de billet — n'hésitez pas à demander.`;
    }
  },
  pt: (category, state) => {
    switch (category) {
      case "navigation": {
        const gate = quietestGate(state);
        const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
        return `${gate.name} tem o menor tempo de espera agora (cerca de ${waitMin} min, ${gate.crowdPct}% de ocupação). Enviei a rota mais rápida para o seu ingresso.`;
      }
      case "accessibility": {
        const gate = accessibleGate(state);
        return `${gate.name} não tem degraus, possui elevador e está a ${gate.crowdPct}% de ocupação. Um membro da equipe pode acompanhá-lo se precisar.`;
      }
      case "transportation": {
        const line = bestTransportLine(state);
        return `${line.name} é sua opção mais rápida agora — ${line.etaMinutes} min de espera, status "${line.status}". Posso enviar atualizações em tempo real.`;
      }
      case "ticketing": {
        const gate = busiestGate(state);
        return `Posso reemitir seu ingresso instantaneamente pelo aplicativo. Se preferir pessoalmente, o balcão perto de ${gate.name} pode ajudar, embora esteja mais cheio (${gate.crowdPct}%).`;
      }
      default:
        return `Bem-vindo ao estádio! Posso ajudar com portões e direções, rotas acessíveis, transporte e estacionamento, ou problemas com o ingresso — é só perguntar.`;
    }
  },
  ja: (category, state) => {
    switch (category) {
      case "navigation": {
        const gate = quietestGate(state);
        const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
        return `現在、${gate.name}が最も待ち時間が短いです(約${waitMin}分、混雑率${gate.crowdPct}%)。最短ルートをチケットに送信しました。`;
      }
      case "accessibility": {
        const gate = accessibleGate(state);
        return `${gate.name}は段差がなくエレベーター完備で、現在の混雑率は${gate.crowdPct}%です。必要であればスタッフがご案内します。`;
      }
      case "transportation": {
        const line = bestTransportLine(state);
        return `現在最も早いのは${line.name}です — 到着まで${line.etaMinutes}分、状況は「${line.status}」です。リアルタイム更新をお送りできます。`;
      }
      case "ticketing": {
        const gate = busiestGate(state);
        return `アプリからすぐにチケットを再発行できます。窓口で手続きされる場合は${gate.name}付近のカウンターをご利用いただけますが、混雑率${gate.crowdPct}%とやや混み合っています。`;
      }
      default:
        return `スタジアムへようこそ！ゲートや道順、バリアフリー経路、シャトルや駐車場、チケットの問題など、お気軽にお尋ねください。`;
    }
  },
  ar: (category, state) => {
    switch (category) {
      case "navigation": {
        const gate = quietestGate(state);
        const waitMin = Math.max(1, Math.round(gate.crowdPct / 8));
        return `${gate.name} لديه حاليًا أقصر وقت انتظار (حوالي ${waitMin} دقيقة، نسبة ازدحام ${gate.crowdPct}%). لقد أرسلت أسرع مسار إلى تذكرتك.`;
      }
      case "accessibility": {
        const gate = accessibleGate(state);
        return `${gate.name} خالٍ من الدرجات ومزود بمصعد، ونسبة الازدحام الحالية ${gate.crowdPct}%. يمكن لأحد أفراد الطاقم مرافقتك إذا احتجت.`;
      }
      case "transportation": {
        const line = bestTransportLine(state);
        return `${line.name} هو خيارك الأسرع الآن — الوقت المتوقع ${line.etaMinutes} دقيقة، والحالة "${line.status}". يمكنني إرسال تحديثات مباشرة.`;
      }
      case "ticketing": {
        const gate = busiestGate(state);
        return `يمكنني إعادة إصدار تذكرتك فورًا عبر التطبيق. إذا كنت تفضل شخصيًا، يمكن للكشك بالقرب من ${gate.name} مساعدتك رغم أنه أكثر ازدحامًا (${gate.crowdPct}%).`;
      }
      default:
        return `مرحبًا بك في الملعب! يمكنني مساعدتك في البوابات والاتجاهات، والمسارات المتاحة لذوي الاحتياجات، والمواصلات ومواقف السيارات، أو مشاكل التذاكر — فقط اسأل.`;
    }
  },
};

export function buildConciergeReply(
  languageCode: LanguageCode,
  category: ConciergeCategory,
  state: OperationalStateSnapshot,
): ReplyPair {
  const replyTranslation = buildEnglishReply(category, state);
  if (languageCode === "en") {
    return { reply: replyTranslation, replyTranslation };
  }

  const builder = REPLY_BUILDERS[languageCode];
  const reply = builder ? builder(category, state) : replyTranslation;
  return { reply, replyTranslation };
}

export function summarizeIntent(category: ConciergeCategory): string {
  return TRANSLATED_MESSAGE_SUMMARY[category];
}
