// Simple client-only marketplace (stores in localStorage).
// Later we will switch to backend API.

const STORAGE_KEY = "kasuwanci_listings_v1";
let listings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let editingId = null;

const $ = id => document.getElementById(id);

function saveListings(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

function render(){
  const container = $('listings');
  container.innerHTML = "";
  if(listings.length === 0){
    $('empty').style.display = 'block';
  } else {
    $('empty').style.display = 'none';
  }

  const q = $('searchInput').value.toLowerCase();
  const activeFilter = document.querySelector('.filterBtn.active')?.dataset.filter || 'all';

  const shown = listings.filter(l=>{
    const matchQ = (l.name + ' ' + l.desc).toLowerCase().includes(q);
    const matchFilter = activeFilter === 'all' ? true : (l.category === activeFilter);
    return matchQ && matchFilter;
  });

  shown.forEach(item=>{
    const card = document.createElement('div');
    card.className = 'card';
    const imgUrl = item.image || '';
    card.innerHTML = `
      <div class="img" style="background-image:url('${imgUrl || 'https://via.placeholder.com/640x360?text=Product'}')"></div>
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <div class="meta">
        <div class="price">₦${Number(item.price).toLocaleString()}</div>
        <div class="actions">
          <button class="chat" onclick="contactSeller('${item.id}')">Tuntuɓi</button>
          <button class="buy" onclick="buyNow('${item.id}')">Sayi</button>
          <button onclick="editItem('${item.id}')">Edit</button>
          <button onclick="deleteItem('${item.id}')">Del</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* CRUD actions */
function newItem(data){
  const id = 'i' + Date.now();
  listings.unshift(Object.assign({id, createdAt:Date.now()}, data));
  saveListings();
  render();
}

function updateItem(id, data){
  listings = listings.map(l => l.id === id ? {...l, ...data} : l);
  saveListings();
  render();
}

function deleteItem(id){
  if(!confirm('Cire wannan kaya?')) return;
  listings = listings.filter(l => l.id !== id);
  saveListings();
  render();
}

/* UI actions */
function openModal(edit=false){
  $('modal').classList.remove('hidden');
  $('pName').focus();
  $('modalTitle').innerText = edit ? 'Gyara Kaya' : 'Saka Sabon Kaya';
}

function closeModal(){
  $('modal').classList.add('hidden');
  editingId = null;
  $('pName').value = '';
  $('pDesc').value = '';
  $('pPrice').value = '';
  $('pImg').value = '';
  $('pCat').value = 'electronics';
}

function editItem(id){
  const item = listings.find(l=>l.id===id);
  if(!item) return alert('Item not found');
  editingId = id;
  $('pName').value = item.name;
  $('pDesc').value = item.desc;
  $('pPrice').value = item.price;
  $('pImg').value = item.image || '';
  $('pCat').value = item.category || 'other';
  openModal(true);
}

/* contact / buy (simple) */
function contactSeller(id){
  const item = listings.find(l => l.id === id);
  if(!item) return;
  const subject = encodeURIComponent(`Tambaya game da ${item.name}`);
  const body = encodeURIComponent(`Sannu, ina sha'awar ${item.name}. Kuna iya sanar da ni farashi da yadda ake karbar kaya?`);
  window.location.href = `mailto:someone@example.com?subject=${subject}&body=${body}`;
}

function buyNow(id){
  const item = listings.find(l => l.id === id);
  if(!item) return;
  // For now open simple confirmation modal — later call backend create-payment
  if(confirm(`Zaka biya ₦${item.price} don ${item.name} ?`)){
    alert('Zai je wurin biyan kudi (mock). Za mu hada CoinPayments / Flutterwave nan gaba.');
  }
}

/* events */
$('addBtn').addEventListener('click', ()=> openModal(false));
$('cancelBtn').addEventListener('click', closeModal);

$('saveBtn').addEventListener('click', ()=>{
  const data = {
    name: $('pName').value.trim(),
    desc: $('pDesc').value.trim(),
    price: Number($('pPrice').value || 0),
    image: $('pImg').value.trim(),
    category: $('pCat').value
  };
  if(!data.name || !data.price){ return alert('Saka suna da farashi'); }

  if(editingId) updateItem(editingId, data);
  else newItem(data);

  closeModal();
});

document.querySelectorAll('.filterBtn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    document.querySelectorAll('.filterBtn').forEach(b=>b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    render();
  });
});

$('searchInput').addEventListener('input', ()=> render());

/* initial sample data if none */
if(listings.length === 0){
  listings = [
    { id:'sample1', name:'Samsung A12', desc:'Good condition, 64GB', price:72000, image:'https://via.placeholder.com/640x360?text=Samsung+A12', category:'electronics' },
    { id:'sample2', name:'Denim Shadda', desc:'Beautiful fabric', price:11000, image:'https://via.placeholder.com/640x360?text=Shadda', category:'fashion' }
  ];
  saveListings();
}

/* start */
render();