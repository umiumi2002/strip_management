UserActivation = "use strict";

// departure用とarrive用のデータを定義
// const departureData = [
//   { runway: "16L", otherInfo: " " ,time: "0605"},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
// ];

// const arriveData = [   
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "16L", otherInfo: " " ,time: " "},
//   { runway: "23", otherInfo: " " ,time: " "},
//   { runway: "23", otherInfo: " " ,time: " "},

// ];

var request = new XMLHttpRequest();
request.open('GET', 'http://127.0.0.1:5000/', true);
request.responseType = 'json';

request.onload = function () {
  var flightdata = this.response;
  console.log(flightdata);

  // ページ読み込み時に初期データを表示

  console.log("aaaa");
  initializeStrips("takeoffStripContainer", flightdata.departures);
  initializeStrips("landingStripContainer", flightdata.arrivals);

  enableDragAndDrop("takeoffStripContainer");
  enableDragAndDrop("landingStripContainer");
};
request.send();

// 緊急用データ行列
// const emergencyData = [
//   { runway: "16L", otherInfo: "Emergency",time: " "},
// ];
// 初期データをストリップとして表示
function initializeStrips(containerId, stripData) {
  const container = document.getElementById(containerId);


  stripData.forEach((item, index) => {
    const { id, name, runway, time } = item;
    console.log(item)
    const strip = document.createElement("div");
    strip.classList.add("strip");

    const isArrivePanel = containerId === "landingStripContainer";

    // <input type="text" value="${otherInfo}" readonly>
    // <input type="text" placeholder="EOBT" readonly>は離陸用のみ着陸機の場合はEOBTをETAに置き換える


    strip.innerHTML = `
            <div>
            <input type="text" value="${name}" readonly>
            <input type="text" value="${runway}" readonly>
            <input type="text" placeholder="Estimated Time" value="${time}" readonly id="estimated">
            </div>
            <div class="check-mark hidden">✓</div>
            ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
            <button class="check-button">完了</button>
          `;

          container.appendChild(strip);

    let isEmergency = false;  // 緊急状態を管理するフラグ

    if (isArrivePanel) {
      const emergencyButton = strip.querySelector(".emergency-button");
      emergencyButton.addEventListener("click", function () {
        if (!isEmergency) {
          setTimeout(() => {
            addStrip(containerId, true); // 緊急ストリップを追加
            // 緊急ボタンの表示を「着陸復行」に変更
          }, 3000);
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
  //   checkButton.forEach(button => {
  //     button.addEventListener("click", async (event) => {
  //         // ボタンが属する行から航空機データを取得する
  //         const airplaneId = event.target.dataset.id; // ボタンにデータ属性を設定しておく
  //         const airplaneType = event.target.dataset.type; // 'departure' または 'arrival'

  //         // サーバーにリクエストを送信
  //         const response = await fetch("/update", {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json"
  //             },
  //             body: JSON.stringify({ id: parseInt(airplaneId), type: airplaneType })
  //         });

  //         // レスポンスを取得
  //         const data = await response.json();

  //         if (response.ok) {
  //             alert("更新完了");
  //             // 必要に応じてUIの更新
  //             console.log("Updated Data:", data);
  //         } else {
  //             alert("更新失敗");
  //             console.error("Error:", data);
  //         }
  //     });
  // });

  });
}

// 各ストリップを追加する
function addStrip(containerId, isEmergency = false) {
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
          <input type="text" value="${emergencyStripData.time}">
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
          <input type="text" placeholder="Runway">
          <input type="text" placeholder="Estimated Time">

        </div>
        <div class="check-mark hidden">✓</div>
        ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
        <button class="check-button">完了</button>
      `;
  }

  // イベントリスナーの追加
  newStrip.addEventListener("touchstart", handleTouchStart);
  newStrip.addEventListener("touchmove", handleTouchMove);
  newStrip.addEventListener("touchend", handleTouchEnd);

  newStrip.addEventListener("dragstart", handleDragStart);
  newStrip.addEventListener("dragover", handleDragOver);
  newStrip.addEventListener("drop", handleDrop);
  newStrip.addEventListener("dragend", handleDragEnd);

  container.appendChild(newStrip);

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
  } else if (!isArrivePanel && !isEmergency) {
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

let touchStartY = 0; // タッチの開始位置を記録
let touchStartElement = null; // ドラッグしている要素を記録

function handleTouchStart(event) {
  if (event.target.tagName === 'INPUT') {
    return;  // inputフィールド内でのタッチを無視
  }
  touchStartElement = this; // タッチした要素を保持
  touchStartY = event.touches[0].clientY; // タッチ開始位置を記録
  this.classList.add("dragging"); // 視覚的なドラッグ中の効果を追加
}

function handleTouchMove(event) {
  event.preventDefault(); // スクロール動作を防止

  if (event.target.tagName === 'INPUT') {
    return;  // inputフィールド内でのタッチ動作を無視
  }
  const touchY = event.touches[0].clientY; // 現在のタッチ位置

  const container = this.parentElement; // 親要素を取得
  const allStrips = Array.from(container.children); // 全ストリップを配列化
  const targetElement = allStrips.find((strip) => {
    const rect = strip.getBoundingClientRect();
    return touchY >= rect.top && touchY <= rect.bottom;
  });

  if (targetElement && targetElement !== touchStartElement) {
    const targetIndex = allStrips.indexOf(targetElement);
    const draggedIndex = allStrips.indexOf(touchStartElement);

    if (draggedIndex < targetIndex) {
      container.insertBefore(touchStartElement, targetElement.nextSibling);
    } else {
      container.insertBefore(touchStartElement, targetElement);
    }
  }
}

function handleTouchEnd() {
  this.classList.remove("dragging"); // 視覚効果をリセット
  touchStartElement = null; // 状態をリセット
  touchStartY = 0;
}

// inputフィールドのクリック時にタッチイベントを無効化
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('touchstart', function (event) {
    event.stopPropagation(); // input内のタッチイベントの伝播を停止
  });
});

function enableDragAndDrop(containerId) {
  const container = document.getElementById(containerId);
  const strips = container.querySelectorAll(".strip");

  strips.forEach((strip) => {
    strip.setAttribute("draggable", "true");

    strip.addEventListener("dragstart", handleDragStart);
    strip.addEventListener("dragover", handleDragOver);
    strip.addEventListener("drop", handleDrop);
    strip.addEventListener("dragend", handleDragEnd);

    // タッチ操作（タブレット用）
    strip.addEventListener("touchstart", handleTouchStart);
    strip.addEventListener("touchmove", handleTouchMove);
    strip.addEventListener("touchend", handleTouchEnd);
  });
}

let draggedElement = null;

function handleDragStart(event) {
  draggedElement = this; // ドラッグしている要素を保持
  event.dataTransfer.effectAllowed = "move";
  this.classList.add("dragging");
}

function handleDragOver(event) {
  event.preventDefault(); // ドロップ可能にする
  event.dataTransfer.dropEffect = "move";

  // ドラッグ中の要素を挿入位置の前に移動
  const container = this.parentElement;
  const allStrips = Array.from(container.children);
  const draggedIndex = allStrips.indexOf(draggedElement);
  const targetIndex = allStrips.indexOf(this);

  if (draggedIndex < targetIndex) {
    container.insertBefore(draggedElement, this.nextSibling);
  } else {
    container.insertBefore(draggedElement, this);
  }
}

function handleDrop(event) {
  event.preventDefault(); // デフォルトの動作を無効化
}

function handleDragEnd() {
  this.classList.remove("dragging");
  draggedElement = null; // ドラッグ要素をリセット
}






