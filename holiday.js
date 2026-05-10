const DAY = 86400000 // DAY[ms]=1[DAY]

async function GetHoliday(targetDate) {
    const HOLIDAY_LIST_URL = "https://holidays-jp.github.io/api/v1/date.json";
    try {
        const res = await fetch(HOLIDAY_LIST_URL);
        const holidayData = await res.json();

        const holidays = Object.keys(holidayData)
            .map(dstr => ({
                name: holidayData[dstr],
                date: new Date(dstr)
            }))
            .filter(holiday => holiday.date - targetDate > 0)
            .sort((a, b) => a.date - b.date);

        //console.log(holidays);
        return holidays[0];
    }

    catch (error) {
        console.error("取得失敗");
        document.getElementById("errorScreen").classList.remove("hidden");
        document.getElementById("gameScreen").classList.add("hidden");
    }
}

function FormatDate(date) {
    let yyyy = date.getFullYear();
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
}

function GetRandomDate() {
    const randomNum = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() + randomNum);
    return date;
}

async function main() {
    let questionCount = 0;
    const MAX_QUESTIONS = 5;
    let totalScore = 0;

    const Sborder = 5;
    const Aborder = 15;
    const Bborder = 40;
    const Cborder = 75;
    const Dborder = 120;
    const Stext = "完璧に祝日を把握していますね。あなたにはカレンダーの才能があります。";
    const Atext = "よく祝日を把握していますね。スケジュール管理はばっちりでしょう。";
    const Btext = "ある程度祝日を把握していますね。カレンダーと向き合う時間を増やしてみましょう。";
    const Ctext = "あまり祝日を把握できていないようです。カレンダーと向き合う時間を増やしてみましょう";
    const Dtext = "祝日を把握できていないようです。まずは、ゴールデンウィークがいつかから覚えましょう。";
    const Etext = "まったく祝日を把握できていないようです。あるいは、適当に入力したのかもしれません。";

    let date = GetRandomDate();
    let ansHoliday = await GetHoliday(date);

    //console.log(ansHoliday);

    const ansInput = document.getElementById("ansInput")
    const ansSubmitButton = document.querySelector("#ansSubmitButton");
    const resultText = document.querySelector("#result");
    const nextButton = document.querySelector("#nextButton");
    document.getElementById("questionNum").textContent = 1;

    document.getElementById("formatDate").textContent = FormatDate(date);

    let userAns = 0;
    ansInput.value = userAns;

    ansSubmitButton.addEventListener("click", () => { //提出時処理
        userAns = Number(ansInput.value);
        if(userAns<0){
            ansInput.value=0;
            userAns=0;
            return;
        }
        else if(userAns>999){
            ansInput.value=999;
            userAns=999; 
            return;
        }

        const userAnsDate = new Date(date);
        userAnsDate.setDate(userAnsDate.getDate() + userAns);
        console.log(userAnsDate);
        const score = Math.floor(Math.abs(userAnsDate - ansHoliday.date) / DAY)
        totalScore += score;

        resultText.textContent = score;

        ansSubmitButton.disabled = true;

        nextButton.classList.toggle("hidden");
        document.getElementById("diffResult").classList.toggle("hidden");
        document.getElementById("holidayResult").textContent = ansHoliday.name + " " + FormatDate(ansHoliday.date);
    });

    nextButton.addEventListener("click", async () => { //次の問題に進むときの処理
        questionCount++;
        document.getElementById("questionNum").textContent = questionCount + 1;
        if (questionCount >= MAX_QUESTIONS) { //終了時処理
            console.log("finished");

            document.getElementById("gameScreen").classList.add("hidden");
            document.getElementById("resultScreen").classList.remove("hidden");
            document.getElementById("finalScore").textContent = totalScore;

            //let totalScore;
            const finalRank = document.getElementById("finalRank");
            const finalRankExplanation = document.getElementById("finalRankExplanation");
            if (0 <= totalScore && totalScore < Sborder) {
                finalRankExplanation.textContent = Stext;
                finalRank.textContent = "S";
                finalRank.classList.add("gamingLight");
            }
            else if (Sborder <= totalScore && totalScore < Aborder) {
                finalRankExplanation.textContent = Atext;
                finalRank.textContent = "A";
            }
            else if (Aborder <= totalScore && totalScore < Bborder) {
                finalRankExplanation.textContent = Btext;
                finalRank.textContent = "B";
            }
            else if (Bborder <= totalScore && totalScore < Cborder) {
                finalRankExplanation.textContent = Ctext;
                finalRank.textContent = "C";
            }
            else if (Cborder <= totalScore && totalScore < Dborder) {
                finalRankExplanation.textContent = Dtext;
                finalRank.textContent = "D";
            }
            else {
                finalRankExplanation.textContent = Etext;
                finalRank.textContent = "E";
            }


            document.getElementById("title").classList.remove("hidden");

            document.getElementById("retryButton").addEventListener("click", () => {
                location.reload();
            });
        }

        ansInput.value = "0";
        ansSubmitButton.disabled = false;
        nextButton.classList.toggle("hidden");
        resultText.textContent = "";
        document.getElementById("diffResult").classList.toggle("hidden");

        date = GetRandomDate();
        ansHoliday = await GetHoliday(date);

        console.log(ansHoliday);

        document.getElementById("formatDate").textContent = FormatDate(date);
    });
}

function OnStart() {
    const startButton = document.getElementById("startButton")
    startButton.addEventListener("click", () => {
        document.getElementById("gameScreen").classList.toggle("hidden");
        document.getElementById("startScreen").classList.add("hidden");
        startButton.classList.add("hidden");
        document.getElementById("title").classList.add("hidden");
        main();
    });
}

OnStart();

