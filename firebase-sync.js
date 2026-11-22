// firebase-sync.js
console.log("🔥 بدأ تحميل ملف المزامنة...");

const firebaseConfig = {
  apiKey: "AIzaSyAh7SrMqY1WCJ_8a79dyfWs98Ue2chaUC0",
  authDomain: "xpower3-1f5fd.firebaseapp.com",
  databaseURL: "https://xpower3-1f5fd-default-rtdb.firebaseio.com",
  projectId: "xpower3-1f5fd",
  storageBucket: "xpower3-1f5fd.firebasestorage.app",
  messagingSenderId: "915610586058",
  appId: "1:915610586058:web:907839b2fcad344b0d9d33"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ تم تهيئة Firebase بنجاح");
} else {
  console.log("✅ Firebase مهيأ مسبقاً");
}

const database = firebase.database();

window.syncAllDataToCloud = function() {
  try {
    console.log("🚀 بدأت عملية المزامنة...");
    let localData = {};
    let keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      
      if (key.includes(':') || key.includes('.') || key.toLowerCase().includes('firebase')) {
          keysToRemove.push(key);
          continue;
      }

      let rawData = localStorage.getItem(key);
      try {
        localData[key] = JSON.parse(rawData);
      } catch (e) {
        localData[key] = rawData;
      }
    }

    for (let j = 0; j < keysToRemove.length; j++) {
        localStorage.removeItem(keysToRemove[j]);
    }

    if (Object.keys(localData).length === 0) {
      showToast("⚠️ لا توجد بيانات صالحة للمزامنة", "#f59e0b");
      return;
    }

    console.log("📦 البيانات التي سيتم رفعها:", localData);

    database.ref('backup').set({
      data: localData,
      lastSync: new Date().toISOString()
    }).then(function() {
      console.log("✅ تمت المزامنة بنجاح!");
      showToast("☁️ تمت المزامنة بنجاح", "#16a34a");
    }).catch(function(error) {
      console.error("❌ فشلت المزامنة:", error);
      showToast("❌ فشلت المزامنة: " + error.message, "#dc2626");
    });

  } catch (e) {
    console.error("❌ خطأ:", e);
  }
};

function showToast(msg, color) {
  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = "position:fixed; bottom:80px; right:20px; background:" + color + "; color:white; padding:10px 18px; border-radius:8px; z-index:99999; font-weight:bold; font-family:system-ui; box-shadow:0 4px 12px rgba(0,0,0,0.15); direction:rtl;";
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 4000);
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("📄 تم تحميل الصفحة، جاري إضافة الزر...");
  let syncBtn = document.createElement('button');
  syncBtn.innerHTML = "☁️ مزامنة";
  syncBtn.style.cssText = "position:fixed; bottom:20px; left:20px; z-index:99999; background:#2563eb; color:white; padding:12px 20px; border:none; border-radius:50px; cursor:pointer; font-weight:bold; font-family:system-ui; font-size:15px; box-shadow:0 4px 12px rgba(37,99,235,0.4);";
  syncBtn.onclick = window.syncAllDataToCloud;
  document.body.appendChild(syncBtn);
  console.log("🔥 زر المزامنة تمت إضافته للشاشة.");
});
