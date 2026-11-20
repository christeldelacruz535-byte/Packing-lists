let defaultTrips = [
  { name: "Beach Trip", icon: "🏖️", items: [
    {name:"T-shirt",cat:"Clothes",done:false},{name:"Shorts",cat:"Clothes",done:false},{name:"Swimsuit",cat:"Clothes",done:false},{name:"Sunscreen",cat:"Toiletries",done:false},{name:"Towel",cat:"Essentials",done:false},{name:"Phone Charger",cat:"Gadgets",done:false},{name:"ID",cat:"Documents",done:false}
  ]},
  { name: "Mountain Hike", icon: "⛰️", items: [
    {name:"Hiking Shoes",cat:"Clothes",done:false},{name:"Jacket",cat:"Clothes",done:false},{name:"Water Bottle",cat:"Essentials",done:false},{name:"First Aid Kit",cat:"Essentials",done:false},{name:"Flashlight",cat:"Gadgets",done:false},{name:"Trail Map",cat:"Documents",done:false}
  ]},
  { name: "City Tour", icon: "🏙️", items: [
    {name:"Comfortable Shoes",cat:"Clothes",done:false},{name:"Camera",cat:"Gadgets",done:false},{name:"Powerbank",cat:"Gadgets",done:false},{name:"Wallet",cat:"Documents",done:false},{name:"Umbrella",cat:"Essentials",done:false}
  ]},
  { name: "Camping", icon: "⛺", items: [
    {name:"Tent",cat:"Essentials",done:false},{name:"Sleeping Bag",cat:"Essentials",done:false},{name:"Cooking Set",cat:"Essentials",done:false},{name:"Insect Repellent",cat:"Toiletries",done:false},{name:"Knife",cat:"Essentials",done:false}
  ]},
  { name: "International Trip", icon: "✈️", items: [
    {name:"Passport",cat:"Documents",done:false},{name:"Visa",cat:"Documents",done:false},{name:"Travel Adapter",cat:"Gadgets",done:false},{name:"Clothes",cat:"Clothes",done:false},{name:"Toothbrush",cat:"Toiletries",done:false},{name:"Boarding Pass",cat:"Documents",done:false}
  ]}
];

let trips = JSON.parse(localStorage.getItem("packmate")) || JSON.parse(JSON.stringify(defaultTrips));
let currentIndex = 0;

function save(){ localStorage.setItem("packmate", JSON.stringify(trips)); }

function renderTrips(){
  let q = document.getElementById("searchTrip").value.toLowerCase();
  let html = "";
  trips.forEach((t,i)=>{
    if(!t.name.toLowerCase().includes(q)) return;
    let done = t.items.filter(x=>x.done).length;
    html += `<div class="trip-card" onclick="openTrip(${i})"><div><b>${t.icon} ${t.name}</b><br><small>${done}/${t.items.length} packed</small></div><span>›</span></div>`;
  });
  document.getElementById("tripList").innerHTML = html;
}

function openTrip(i){
  currentIndex = i;
  document.getElementById("homePage").style.display="none";
  document.getElementById("settingsPage").style.display="none";
  document.getElementById("listPage").style.display="block";
  document.getElementById("tripTitle").innerText = trips[i].icon + " " + trips[i].name;
  renderItems();
}

function renderItems(){
  let t = trips[currentIndex];
  let q = document.getElementById("searchItem").value.toLowerCase();
  let done = t.items.filter(x=>x.done).length;
  document.getElementById("progressText").innerText = `${done}/${t.items.length} Packed - ${t.items.length? Math.round(done/t.items.length*100):0}%`;
  document.getElementById("progressFill").style.width = (t.items.length? done/t.items.length*100:0) + "%";
  let cats = ["Clothes","Toiletries","Gadgets","Documents","Essentials"];
  let html = "";
  cats.forEach(cat=>{
    let list = t.items.map((it,idx)=>({...it,idx})).filter(it=>it.cat===cat && it.name.toLowerCase().includes(q));
    if(list.length){
      html += `<div class="cat-title">${cat}</div>`;
      list.forEach(it=>{
        html += `<div class="item ${it.done?'done':''}"><label><input type="checkbox" ${it.done?'checked':''} onchange="toggleItem(${it.idx})"> ${it.name}</label><button onclick="deleteItem(${it.idx})">X</button></div>`;
      });
    }
  });
  document.getElementById("itemList").innerHTML = html || "<p>No items found.</p>";
}

function toggleItem(idx){
  trips[currentIndex].items[idx].done = !trips[currentIndex].items[idx].done;
  if(document.getElementById("soundToggle").checked){
    let a = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
    a.play().catch(()=>{});
  }
  save(); renderItems(); renderTrips();
}
function deleteItem(idx){ trips[currentIndex].items.splice(idx,1); save(); renderItems(); renderTrips(); }

document.getElementById("addItemBtn").onclick = ()=>{
  let name = document.getElementById("newItemName").value.trim();
  if(!name) return alert("Type item name first!");
  trips[currentIndex].items.push({name:name, cat:document.getElementById("newItemCat").value, done:false});
  document.getElementById("newItemName").value="";
  save(); renderItems(); renderTrips();
};
document.getElementById("addTripBtn").onclick = ()=>{
  let name = prompt("New Trip Name:");
  if(!name) return;
  trips.push({name:name, icon:"🎒", items:[], custom:true});
  save(); renderTrips();
};
document.getElementById("searchTrip").oninput = renderTrips;
document.getElementById("searchItem").oninput = renderItems;
document.getElementById("backBtn").onclick = ()=>{ document.getElementById("listPage").style.display="none"; document.getElementById
