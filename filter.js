/* סינון מילים – משמש גם את דף התלמידים וגם את מסך ההקרנה.
   להוספת מילה חסומה: להוסיף אותה לאחת הרשימות למטה ולשמור. */
const WordFilter = (() => {
  // נחסמות אם הן מופיעות בכל מקום בתוך המילה
  const STEMS = [
    "זונה","זונות","שרמוט","שרמוטה","מניאק","מנייק","חארה","מזדיין","לזיין","זיון","תזדיין",
    "מטומטם","מטומטמ","אידיוט","מפגר","טמבל","דביל","אהבל","סתום","סתומ","מגעיל",
    "קוקסינל","לסבית","כושי","ערבוש","פרחה","חלאה","חלאות","זבל","נבלה","סקס",
    "מוות","רצח","רוצח","לרצוח","נרצח","בוגד","בגידה","נאצי","היטלר","יודנראט",
    "שמאלן","שמאלנ","ביבי","ביביסט","נתניהו","קפלניסט","ליכוד","בנגביר","סמוטריץ","לפיד",
    "עמיר","יגאל"
  ];
  // נחסמות רק כמילה שלמה (אפשר עם אות שימוש אחת לפניה), כדי לא לפסול מילים תמימות
  const EXACT = ["זין","כוס","חרא","דפוק","דפוקה","מת","למות","תמות","ימות","חמור","כלב","שמן","שמנה","הומו","הומואים",
    "כוסית","כוסאמק","כוסעמק","ערס","ימין","שמאל","ימני","ימנים","ימנית","מרץ","גנץ","מתים"];
  const EN = ["fuck","fck","shit","bitch","dick","ass","sex","porn","nazi","hitler","kill","die","whore","slut","gay","fag"];
  const EN_SUB = ["fuck","shit","bitch","porn","nazi","hitler","whore","slut"];

  const norm = s => (s || "").replace(/[֑-ׇ]/g, "")      // ניקוד
    .replace(/[״"׳'`.,!?;:()\[\]{}<>\-–—_*\/\\|~^%$#@&+=]/g, " ")
    .replace(/\s+/g, " ").trim();
  const tokens = s => s.toLowerCase().split(" ").filter(Boolean);
  const finals = s => s.replace(/ך/g,"כ").replace(/ם/g,"מ").replace(/ן/g,"נ").replace(/ף/g,"פ").replace(/ץ/g,"צ");
  const stemsN = STEMS.map(finals), exactN = EXACT.map(finals);

  function blocked(text){
    const flat = finals(text.toLowerCase().replace(/\s/g, ""));
    if (stemsN.some(st => flat.includes(st.replace(/\s/g, "")))) return true;
    for (const t of tokens(text)){
      const f = finals(t);
      if (exactN.includes(f) || (f.length > 2 && "וה".includes(f[0]) && exactN.includes(f.slice(1)))) return true;
      if (EN.includes(t) || EN_SUB.some(e => t.includes(e))) return true;
    }
    return false;
  }

  function check(raw){
    const w = norm(raw);
    if (!w) return {ok:false, reason:"כתבו מילה אחת או שתיים."};
    if (/[0-9]/.test(w) || /https?|www/i.test(raw)) return {ok:false, reason:"רק מילים, בלי מספרים או קישורים."};
    if (!/^[א-תa-zA-Z ]+$/.test(w)) return {ok:false, reason:"אפשר לכתוב רק אותיות בעברית או באנגלית."};
    if (w.split(" ").length > 2) return {ok:false, reason:"עד שתי מילים בלבד."};
    if (w.replace(/ /g,"").length < 2) return {ok:false, reason:"המילה קצרה מדי."};
    if (/(.)\1\1/.test(w.replace(/ /g,""))) return {ok:false, reason:"נסו לכתוב מילה אמיתית."};
    if (blocked(w)) return {ok:false, reason:"המילה הזאת לא תוצג על המסך. נסו לנסח אחרת, בכבוד."};
    return {ok:true, word:w};
  }
  return {check, norm};
})();
