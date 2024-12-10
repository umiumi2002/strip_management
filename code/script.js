UserActivation = "use strict";


var request = new XMLHttpRequest();
request.open('GET', 'http://127.0.0.1:5000/', true);
request.responseType = 'json';


let flightdata = {};
request.onload = function () {
  flightdata = this.response;
  console.log(flightdata);

  // ページ読み込み時に初期データを表示
  initializeStrips();

  // enableDragAndDrop("takeoffStripContainer");
  // enableDragAndDrop("landingStripContainer");
};
request.send();

// 緊急用データ行列
// const emergencyData = [
//   { runway: "16L", otherInfo: "Emergency",time: " "},
// ];
// 初期データをストリップとして表示
// function initializeStrips(containerId, stripData) {
//   const container = document.getElementById(containerId);


//   stripData.forEach((item) => {
//     const { id, name, runway, time, is_completed } = item;
//     console.log(item)
//     const strip = document.createElement("div");
//     strip.classList.add("strip");

//     const isArrivePanel = containerId === "landingStripContainer";

//     strip.innerHTML = `
//             <div>
//             <input type="text" value="${name}" readonly>
//             <input type="text" value="${runway}" readonly>
//             <input type="text"  value="${time}" readonly id="estimated">
//             </div>
//             <div class="check-mark ${is_completed ? "" : "hidden"}">✓</div>
//             ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
//             <button class="check-button" data-id="${id}" data-type="${isArrivePanel ? "arrival" : "departure"}">${is_completed ? "取消" : "完了"}</button>
//           `;

//     container.appendChild(strip);

//     let isEmergency = false;  // 緊急状態を管理するフラグ

//     if (isArrivePanel) {
//       const emergencyButton = strip.querySelector(".emergency-button");
//       emergencyButton.addEventListener("click", function () {
//         if (!isEmergency) {
//           setTimeout(() => {
//             addStrip(containerId, true); // 緊急ストリップを追加
//             // 緊急ボタンの表示を「着陸復行」に変更
//           }, 3000);
//           this.textContent = "復行";
//         } else {
//           removeStrip(containerId); // 追加した緊急ストリップを削除
//           // 緊急ボタンの表示を「緊急」に戻す
//           this.textContent = "緊急";
//         }
//         isEmergency = !isEmergency; // 緊急状態をトグル
//       });
//     }
//     // チェックボタンのイベントリスナーを追加
//     const checkButton = strip.querySelector(".check-button");
//     const checkMark = strip.querySelector(".check-mark");

//     // `checkMark` の背景色を設定
//     checkMark.style.backgroundColor = isArrivePanel ? "orange" : "lightblue";

//     checkButton.addEventListener("click", async function () {
//       const newState = !checkMark.classList.contains("hidden");
//       checkMark.classList.toggle("hidden"); // 表示/非表示を切り替える
//       checkButton.textContent = newState ? "完了" : "取消";


//       // ボタンが属する行から航空機データを取得する
//       const airplaneId = checkButton.dataset.id;
//       const airplaneType = checkButton.dataset.type;
//       console.log(airplaneId, airplaneType, newState);

//       // サーバーにリクエストを送信して、`is_completed`の状態を更新
//      try {
//       const response = await fetch("http://127.0.0.1:5000/update_status", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ id: parseInt(airplaneId), type: airplaneType, is_completed: newState })

//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log("更新成功:", data);
//       } else {
//         console.error("更新失敗:", data);
//       }
//     } catch (error) {
//       console.error("エラー:", error);
//     }
//   });
//     container.appendChild(strip);
//   });
// }

// 10秒ごとに画面をリロード
setInterval(() => {
  location.reload();
}, 10000);


function initializeStrips() {
  // ページ読み込み時にサーバーからストリップデータを取得
  fetch("http://127.0.0.1:5000/get_strips")
    .then(response => response.json())
    .then(data => {
      // 出発機のストリップを表示
      data.departures.forEach(stripData => {
        const container = document.getElementById("takeoffStripContainer");
        // 既にIDが追加されているか確認
        // if (!document.querySelector(`[data-id="${stripData.id}"]`)) {
        const strip = createStrip(stripData, "takeoffStripContainer");
        container.appendChild(strip);
        // }
      });

      // 到着機のストリップを表示
      data.arrivals.forEach(stripData => {
        console.log(stripData);
        const container = document.getElementById("landingStripContainer");
        // 既にIDが追加されているか確認
        // if (!document.querySelector(`[data-id="${stripData.id}"]`)) {
        const strip = createStrip(stripData, "landingStripContainer");
        container.appendChild(strip);
        //  }
      });

      console.log("data", data);

      return data;
    })
    .catch(error => console.error("データの取得エラー:", error));
}

// ストリップの状態をサーバーに送信
// function updateStripStatus(id, type, isCompleted) {
//   fetch("http://127.0.0.1:5000/update_status", {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       id: id,
//       type: type,
//       is_completed: isCompleted
//     })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.status === "success") {
//       console.log(`状態更新成功: ${data}`);
//     } else {
//       console.error(`状態更新失敗: ${data}`);
//     }
//   })
//   .catch(error => {
//     console.error("状態更新エラー:", error);
//   });
// }


// 各ストリップを追加する
// function addStrip(containerId, isEmergency = false) {
//   const container = document.getElementById(containerId);

//   const isArrivePanel = containerId === "landingStripContainer";
//   // 既存のストリップ数を取得して次の航空機名を決定
//   const existingStrips = container.querySelectorAll(".strip");
//   const nextPlaneNumber = existingStrips.length + 1;
//   const nextPlaneName = `plane${nextPlaneNumber}`;

//   const newStrip = document.createElement("div");
//   newStrip.classList.add("strip");

//   if (isEmergency) {
//     // 緊急用データを使って新しいストリップを追加
//     const emergencyStripData = emergencyData[0]; // 必要に応じてデータを変更
//     newStrip.innerHTML = `
//         <div>
//           <input type="text" value="${nextPlaneName}" readonly>
//           <input type="text" value="${emergencyStripData.runway}" readonly>
//           <input type="text" value="${emergencyStripData.time}">
//         </div>
//         <div class="check-mark hidden" style="background-color: red;">✓</div>
//         ${isArrivePanel ? `<button class="emergency-button">復行</button>` : ""}
//         <button class="check-button">完了</button>
//       `;
//   } else {
//     // 通常のストリップ追加処理
//     newStrip.innerHTML = `
//         <div>
//           <input type="text" value="${nextPlaneName}" >
//           <input type="text" placeholder="Runway">
//           <input type="text" placeholder="Estimated Time">

//         </div>
//         <div class="check-mark hidden">✓</div>
//         ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
//         <button class="check-button">完了</button>
//       `;
//   }

//   // イベントリスナーの追加
//   newStrip.addEventListener("touchstart", handleTouchStart);
//   newStrip.addEventListener("touchmove", handleTouchMove);
//   newStrip.addEventListener("touchend", handleTouchEnd);

//   newStrip.addEventListener("dragstart", handleDragStart);
//   newStrip.addEventListener("dragover", handleDragOver);
//   newStrip.addEventListener("drop", handleDrop);
//   newStrip.addEventListener("dragend", handleDragEnd);

//   container.appendChild(newStrip);

//   let isEmergencyActive = isEmergency; // 緊急ストリップの状態を管理

//   // 緊急ボタンのイベントリスナー（landingStripContainer のみ機能）
//   if (isArrivePanel) {
//     const emergencyButton = newStrip.querySelector(".emergency-button");
//     emergencyButton.addEventListener("click", function () {
//       if (!isEmergencyActive) {
//         addStrip(containerId, true); // 緊急ストリップを追加

//         // 緊急ボタンの表示を「着陸復行」に変更
//         this.textContent = "復行";
//       } else {
//         removeStrip(containerId); // 追加した緊急ストリップを削除

//         // 緊急ボタンの表示を「緊急」に戻す
//         this.textContent = "緊急";
//       }
//       isEmergencyActive = !isEmergencyActive; // 緊急状態をトグル
//     });
//   }

//   // チェックボタンのイベントリスナーを追加
//   const checkButton = newStrip.querySelector(".check-button");
//   const checkMark = newStrip.querySelector(".check-mark");

//   // `checkMark` の背景色を変更
//   if (isArrivePanel && !isEmergency) {
//     checkMark.style.backgroundColor = "orange"; // 到着の場合
//   } else if (!isArrivePanel && !isEmergency) {
//     checkMark.style.backgroundColor = "lightblue"; // 離陸の場合
//   }

//   checkButton.addEventListener("click", function () {
//     checkMark.classList.toggle("hidden"); // 表示/非表示を切り替える
//     this.textContent = this.textContent === "完了" ? "取消" : "完了";
//   });
//   container.appendChild(newStrip);

//   // スワイプ動作の処理を追加
//   newStrip.addEventListener("touchstart", handleTouchStart);
//   newStrip.addEventListener("touchend", function (event) {
//     handleTouchEnd(event, newStrip);
//   });

//   // ストリップをタッチした時にチェックボタンを表示
//   newStrip.addEventListener("click", function () {
//     const checkButton = this.querySelector(".check-button");
//     checkButton.style.display = "block"; // チェックボタンを表示
//   });

//   // チェックボタンをクリックした時に、ストリップにチェックを付ける
//   newStrip
//     .querySelector(".check-button").addEventListener("click", function (event) {
//       event.stopPropagation(); // 親要素のクリックイベントを発火させない
//       newStrip.classList.toggle("checked"); // チェック状態を切り替え
//       // this.style.display = "none"; // チェックボタンを非表示にする

//       strip.classList.toggle("checked");
//     });
//   container.appendChild(newStrip);

//   const stripData = {
//     planeName: nextPlaneName,
//     runway: newStrip.querySelector('input[placeholder="Runway"]').value || '',
//     estimatedTime: newStrip.querySelector('input[placeholder="Estimated Time"]').value || '',
//     isEmergency: isEmergency
//   };

//   sendStripToServer(stripData);
// }

async function addStrip(containerId) {
  const container = document.getElementById(containerId);
  // サーバーからストリップデータを取得
  const openData = await fetch("http://127.0.0.1:5000/get_strips")
    .then(response => response.json())
    .then(data => { return data; })

  // クリックされたボタンによって、適切なデータを選択
  if (containerId === 'takeoffStripContainer' && openData.departures.length < flightdata.departures.length) {
    const stripData = flightdata.departures[openData.departures.length];

    // サーバーにストリップを追加するリクエストを送信
    fetch("http://127.0.0.1:5000/add_strip", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'departure',
        strip_data: stripData
      })
    });
    // 画面リロード
    location.reload();
  } else if (containerId === 'landingStripContainer' && openData.arrivals.length < flightdata.arrivals.length) {
    const stripData = flightdata.arrivals[openData.arrivals.length];

    // サーバーにストリップを追加するリクエストを送信
    fetch("http://127.0.0.1:5000/add_strip", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'arrival',
        strip_data: stripData
      })
    });
    location.reload();
  }
}

// ストリップを作成する関数
function createStrip(data, containerId) {
  const { id, name, runway, time, is_completed } = data;
  const strip = document.createElement("div");
  strip.classList.add("strip");

  const isArrivePanel = containerId === "landingStripContainer";

  strip.innerHTML = `
    <div>
      <input type="text" value="${name}" readonly>
      <input type="text" value="${runway}" readonly>
      <input type="text" value="${time}" readonly id="estimated">
    </div>
    <div class="check-mark ${is_completed ? "" : "hidden"}">✓</div>
    ${isArrivePanel ? `<button class="emergency-button">緊急</button>` : ""}
    <button class="check-button" data-id="${id}" data-type="${isArrivePanel ? "arrival" : "departure"}">${is_completed ? "取消" : "完了"}</button>
  `;

  strip.addEventListener("dragstart", handleDragStart);
  strip.addEventListener("dragover", handleDragOver);
  strip.addEventListener("drop", handleDrop);
  strip.addEventListener("dragend", handleDragEnd);
  // タッチ操作（タブレット用）
  strip.addEventListener("touchstart", handleTouchStart);
  strip.addEventListener("touchmove", handleTouchMove);
  strip.addEventListener("touchend", handleTouchEnd);

  let isEmergency = false;  // 緊急状態を管理するフラグ

  if (isArrivePanel) {
    const emergencyButton = strip.querySelector(".emergency-button");
    emergencyButton.addEventListener("click", function () {
      if (!isEmergency) {
        // setTimeout(() => {
          addEmergencyStripToArrivals(containerId,data); // 緊急ストリップを追加
          this.textContent = "復行";
        // }, 3000);
      } else {
        // removeEmergencyStripFromArrivals(containerId); // 緊急ストリップを削除
        this.textContent = "緊急";
      }
      isEmergency = !isEmergency; // 緊急状態をトグル
    });
  }

  const checkButton = strip.querySelector(".check-button");
  const checkMark = strip.querySelector(".check-mark");

  checkMark.style.backgroundColor = isArrivePanel ? "orange" : "lightblue";

  checkButton.addEventListener("click", async function () {
    const newState = !checkMark.classList.contains("hidden");
    checkMark.classList.toggle("hidden");
    checkButton.textContent = newState ? "完了" : "取消";

    const airplaneId = checkButton.dataset.id;
    const airplaneType = checkButton.dataset.type;

    // サーバーに状態を更新するリクエストを送信
    try {
      const response = await fetch("http://127.0.0.1:5000/update_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: parseInt(airplaneId), type: airplaneType, is_completed: newState })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("更新成功:", data);
      } else {
        console.error("更新失敗:", data);
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  });

  return strip;
}


// 緊急時にストリップをarrivalsに追加する関数
function addEmergencyStripToArrivals(data) {
  fetch('http://127.0.0.1:5000/update_emergency', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    console.log('Emergency flight added:', data);
    // 追加後の到着機データを表示などの処理を行う
})
.catch(error => {
    console.error('Error:', error);
});
}

// 緊急ストリップを削除する関数
function removeEmergencyStripFromArrivals(containerId) {
  // flightStripから緊急ストリップを削除
  flightStrip.arrivals.pop();

  // UIから削除
  const container = document.getElementById(containerId);
  const strips = container.querySelectorAll(".strip");
  const lastStrip = strips[strips.length - 1];
  container.removeChild(lastStrip);

  // サーバーに更新内容を送信
  fetch("http://127.0.0.1:5000/update_arrivals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      arrivals: flightStrip.arrivals // 更新されたarrivalsデータ
    })
  })
    .then((response) => response.json())
    .then((data) => console.log("Arrivals updated successfully:", data))
    .catch((error) => console.error("Error updating arrivals:", error));
}

let touchStartY = 0; // タッチの開始位置を記録
let touchStartElement = null; // ドラッグしている要素を記録

function handleTouchStart(event) {
  if (event.target.tagName === 'INPUT') {
    return;  // inputフィールド内でのタッチを無視
  }
  touchStartElement = this; // タッチした要素を保持
  console.log("touchStartElement", touchStartElement);
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

  // 親要素が takeoffStripContainer の場合
  updateOrder("takeoffStripContainer", "departure");

  // 親要素が landingStripContainer の場合
  updateOrder("landingStripContainer", "arrival");

}

// 共通の順番取得＆送信処理を関数化
function updateOrder(containerId, type) {
  const container = document.getElementById(containerId);
  if (container) {
    const newOrder = Array.from(container.children)
      .map((child) => {
        const checkButton = child.querySelector(".check-button"); // ストリップ内のチェックボタンを探す
        return checkButton ? checkButton.dataset.id : null; // data-id を取得
      })
      .filter((id) => id !== null); // null を除外

    console.log(`New order for ${type}s:`, newOrder);

    // サーバーに順番を送信
    fetch("http://127.0.0.1:5000/update_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type, // "departure" または "arrival"
        order: newOrder // 順番
      })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log(`Order updated on server successfully for ${type}s:`, data);
      })
      .catch((error) =>
        console.error(`Error updating order on server for ${type}s:`, error)
      );
  }
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
  event.preventDefault();
}

function handleDragEnd() {
  this.classList.remove("dragging");
  draggedElement = null; // ドラッグ要素をリセット
}






