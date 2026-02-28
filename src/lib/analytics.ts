import { METRIKA_ID } from "./constants";

// Yandex.Metrika types
declare global {
  interface Window {
    ym?: (id: string, action: string, target?: string, params?: Record<string, unknown>) => void;
  }
}

export function ym(action: string, target?: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ym) {
    window.ym(METRIKA_ID, action, target, params);
  }
}

export function reachGoal(target: string, params?: Record<string, unknown>) {
  ym("reachGoal", target, params);
}

export const goals = {
  // Forms
  FORM_OPEN: "form_open",
  FORM_SUBMIT: "form_submit",
  FORM_SUCCESS: "form_success",
  FORM_ERROR: "form_error",

  // Quiz
  QUIZ_START: "quiz_start",
  QUIZ_STEP_2: "quiz_step_2",
  QUIZ_STEP_3: "quiz_step_3",
  QUIZ_STEP_4: "quiz_step_4",
  QUIZ_SUBMIT: "quiz_submit",
  QUIZ_SUCCESS: "quiz_success",

  // Contacts
  PHONE_CLICK: "phone_click",
  WHATSAPP_CLICK: "whatsapp_click",
  CALLBACK_OPEN: "callback_open",
  CALLBACK_SUBMIT: "callback_submit",

  // Navigation
  MENU_OPEN: "menu_open",
  SERVICE_CLICK: "service_click",
  PORTFOLIO_VIEW: "portfolio_view",

  // Funnel
  EXIT_POPUP_SHOW: "exit_popup_show",
  EXIT_POPUP_SUBMIT: "exit_popup_submit",
  SOCIAL_PROOF_SHOW: "social_proof_show",
  TIMER_VIEW: "timer_view",
  LOAD_BAR_VIEW: "load_bar_view",

  // Page
  PAGE_SCROLL_50: "page_scroll_50",
  PAGE_SCROLL_100: "page_scroll_100",
} as const;

export const METRIKA_SCRIPT = `
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(${METRIKA_ID}, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });
`;
