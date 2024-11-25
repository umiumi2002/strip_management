UserActivation = "use strict";

// departure用とarrive用のデータを定義
  const departureData = [
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
  ];

  const arriveData = [
    { runway: "16L", otherInfo: " " },
    { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "16L", otherInfo: " " },
    // { runway: "23", otherInfo: " " },
    { runway: "23", otherInfo: " " },
    { runway: "23", otherInfo: " " },
  ];

  // 緊急用データ行列
const emergencyData = [
  { runway: "16L", otherInfo: "Emergency" },
];
    // 初期データをストリップとして表示
    function initializeStrips(containerId, data) {
        const container = document.getElementById(containerId);
    
        data.forEach((item, index) => {
          const { runway, otherInfo } = item;
          const strip = document.createElement("div");
          strip.classList.add("strip");

          const isArrivePanel = containerId === "landingStripContainer";

    
          strip.innerHTML = `
          <div>
            <input type="text" value="plane${index + 1}" readonly>
            <input type="text" value="${runway}" readonly>
            <input type="text" value="${otherInfo}" readonly>
            </div>
            <div class="check-mark hidden">✓</div>
            ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
            <button class="check-button">完了</button>
          `;

          let isEmergency = false;  // 緊急状態を管理するフラグ

          if (isArrivePanel) {
            const emergencyButton = strip.querySelector(".emergency-button");
            emergencyButton.addEventListener("click", function () {
                if (!isEmergency) {
              addStrip(containerId, true); // 緊急ストリップを追加

              // 緊急ボタンの表示を「着陸復行」に変更
            this.textContent = "復行";
            } else {
                removeStrip(containerId); // 追加した緊急ストリップを削除
              // 緊急ボタンの表示を「緊急」に戻す
              this.textContent = "緊急";
            }
            isEmergency = !isEmergency; // 緊急状態をトグル
            });
          }
          // チェックボタンのイベントリスナーを追加
      const checkButton = strip.querySelector(".check-button");
      const checkMark = strip.querySelector(".check-mark");

      // `checkMark` の背景色を変更
      if (isArrivePanel) {
          checkMark.style.backgroundColor = "orange"; // 到着の場合
      } else {
          checkMark.style.backgroundColor = "lightblue"; // 離陸の場合
      }

      checkButton.addEventListener("click", function () {
        checkMark.classList.toggle("hidden"); // 表示/非表示を切り替える
         // ボタンのテキストをトグル
      if (this.textContent === "完了") {
        this.textContent = "取消"; // チェック済みの状態
      } else {
        this.textContent = "完了"; // チェックを解除した状態
      }
      });
          container.appendChild(strip);
        });
      }

  // 各ストリップを追加する
function addStrip(containerId,isEmergency = false) {
    const container = document.getElementById(containerId);

    const isArrivePanel = containerId === "landingStripContainer";
    // 既存のストリップ数を取得して次の航空機名を決定
    const existingStrips = container.querySelectorAll(".strip");
    const nextPlaneNumber = existingStrips.length + 1;
    const nextPlaneName = `plane${nextPlaneNumber}`;  

    const newStrip = document.createElement("div");
    newStrip.classList.add("strip");

    if (isEmergency) {
      // 緊急用データを使って新しいストリップを追加
      const emergencyStripData = emergencyData[0]; // 必要に応じてデータを変更
      newStrip.innerHTML = `
        <div>
          <input type="text" value="${nextPlaneName}" readonly>
          <input type="text" value="${emergencyStripData.runway}" readonly>
          <input type="text" value="${emergencyStripData.otherInfo}" readonly>
        </div>
        <div class="check-mark hidden" style="background-color: red;">✓</div>
        ${isArrivePanel ? `<button class="emergency-button">復行</button>` : ""}
        <button class="check-button">完了</button>
      `;
    } else {
      // 通常のストリップ追加処理
      newStrip.innerHTML = `
        <div>
          <input type="text" value="${nextPlaneName}" >
          <input type="text" placeholder="滑走路">
          <input type="text" placeholder="その他情報">
        </div>
        <div class="check-mark hidden">✓</div>
        ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
        <button class="check-button">完了</button>
      `;
    }
  
    let isEmergencyActive = isEmergency; // 緊急ストリップの状態を管理

      // 緊急ボタンのイベントリスナー（landingStripContainer のみ機能）
  if (isArrivePanel) {
    const emergencyButton = newStrip.querySelector(".emergency-button");
    emergencyButton.addEventListener("click", function () {
      if (!isEmergencyActive) {
        addStrip(containerId, true); // 緊急ストリップを追加

        // 緊急ボタンの表示を「着陸復行」に変更
        this.textContent = "復行";
      } else {
        removeStrip(containerId); // 追加した緊急ストリップを削除

        // 緊急ボタンの表示を「緊急」に戻す
        this.textContent = "緊急";
      }
      isEmergencyActive = !isEmergencyActive; // 緊急状態をトグル
    });
  }

      // チェックボタンのイベントリスナーを追加
    const checkButton = newStrip.querySelector(".check-button");
    const checkMark = newStrip.querySelector(".check-mark");

       // `checkMark` の背景色を変更
    if (isArrivePanel && !isEmergency) {
        checkMark.style.backgroundColor = "orange"; // 到着の場合
    } else if (!isArrivePanel && !isEmergency)  {
        checkMark.style.backgroundColor = "lightblue"; // 離陸の場合
    }

    checkButton.addEventListener("click", function () {
      checkMark.classList.toggle("hidden"); // 表示/非表示を切り替える
      

      // ボタンのテキストをトグル
      if (this.textContent === "完了") {
        this.textContent = "取消"; // チェック済みの状態
      } else {
        this.textContent = "完了"; // チェックを解除した状態
      }
    });
      container.appendChild(newStrip);
    
        // スワイプ動作の処理を追加
        newStrip.addEventListener("touchstart", handleTouchStart);
        newStrip.addEventListener("touchend", function (event) {
          handleTouchEnd(event, newStrip);
        });

        // ストリップをタッチした時にチェックボタンを表示
        newStrip.addEventListener("click", function () {
          const checkButton = this.querySelector(".check-button");
          checkButton.style.display = "block"; // チェックボタンを表示
        });

        // チェックボタンをクリックした時に、ストリップにチェックを付ける
        newStrip
          .querySelector(".check-button")
          .addEventListener("click", function (event) {
            event.stopPropagation(); // 親要素のクリックイベントを発火させない
            newStrip.classList.toggle("checked"); // チェック状態を切り替え
            // this.style.display = "none"; // チェックボタンを非表示にする
            
            strip.classList.toggle("checked");
          });
        container.appendChild(newStrip);
      }
    

      // 最後のストリップを削除
function removeStrip(containerId) {
  const container = document.getElementById(containerId);
  const strips = container.querySelectorAll(".strip");
  if (strips.length > 0) {
    strips[strips.length - 1].remove(); // 最後のストリップを削除
  }
}
      let startX;

      function handleTouchStart(event) {
        startX = event.touches[0].clientX;
      }

      function handleTouchEnd(event, strip) {
        const checkButton = strip.querySelector(".check-button");
        checkButton.addEventListener("click", () => {
          // チェック状態を切り替える
        });
      }

      // ページ読み込み時に初期データを表示
  document.addEventListener("DOMContentLoaded", () => {
    initializeStrips("takeoffStripContainer", departureData);
    initializeStrips("landingStripContainer", arriveData);
  });