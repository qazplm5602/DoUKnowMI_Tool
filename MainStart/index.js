$(Ready);

const messages = [
    "저 아세요?",
    "Do You Know Me?",
    "私を知っていますか？",
    "你认识我吗？",
    "你認識我嗎？",
    "¿Me conoces?",
    "Me connais-tu ?",
    "Kennen Sie mich?",
    "Mi conosci?",
    "Conheces-me?",
    "Ты меня знаешь?",
    "هل تعرفني؟",
    "क्या आप मुझे जानते हैं?",
    "আপনি আমাকে জানেন?",
    "کیا آپ مجھے جانتے ہیں؟",
    "Tu me connais?",
    "Tudae-eya naneun al-a?",
    "Με ξέρεις;",
    "Efsanevi misin?",
    "Seni biliyor muyum?",
    "तू मला ओळखतोस?",
    "נכיר לך?",
    "At kjenner deg?",
    "تو مرا جانتا ہے؟",
    "Me tunned mind?",
    "Tunnetko minut?",
    "Você me conhece?",
    "Vous me connaissez?",
    "Mkujua?",
    "Zinza kundza mina?",
    "Conoscimi?",
    "Labai gaila, bet aš tave pažįstu?",
    "Es tevi pazīstu?",
    "Atei tu agabi?",
    "Tunajua?",
    "Məni tanıyırsan?",
    "Tá aithne agat orm?",
    "Bạn có biết tôi không?",
    "Bala'i ko arég kaw?",
    "איך קענען דיר וויסן?",
    "Bikya?",
    "Mwen konnen ou?",
    "Bumi anget kowe?",
    "Ikaw nakakakita kanako?",
    "Cunosti ma?",
    "Poznaješ me?",
    "Conoces-me?",
    "Poznaš me?",
    "Fahamka?",
    "Conheces-me?",
    "Mimi wakukujua?",
    "Eu te conheço?",
    "Мен сені танып тұрсың ба?",
    "Men seni taniyap turamanmi?",
    "Mina kende märgata?",
    "Меня ты знаешь?",
    "Conozcámonos?",
    "Znas me?",
    "Nu te cunosc?",
    "Ти мене знаєш?",
    "Eu te conheço?",
    "Cunusti di mè?",
    "நீ என்னை அறியுவாயா?",
    "คุณรู้จักฉันไหม?",
    "Sen beni tanıyor musun?",
    "Ты меня знаешь?",
    "Seni bilmek man?",
    "موږ تاسو سره ولاړ شو؟",
    "Sifundzani?",
    "Մի՞տես ինձ:",
    "Seni taniyimı?"
]

let currentIndex = 0;

function Ready() {
    setInterval(ChangeText, 5000);
}

function ChangeText() {
    currentIndex ++;
    if (currentIndex >= messages.length) {
        currentIndex = 0;
    }

    const message = messages[currentIndex];
    $("#DOYouKnowMI").fadeOut(300, function() {
        $(this).text(message).fadeIn(300);
    });
}