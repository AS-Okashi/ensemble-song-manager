// ============================
// Ensemble Song Manager
// app.js
// ============================

let songs = [];
let filteredSongs = [];

const table = document.getElementById("songTable");
const searchInput = document.getElementById("searchInput");
const songCount = document.getElementById("songCount");
// ----------------------------
// JSON読込
// ----------------------------

async function loadSongs() {

    try {

        const response = await fetch("data/songs.json");

        songs = await response.json();

        filteredSongs = [...songs];

        renderTable(filteredSongs);

        createUnitFilter();

    } catch (error) {

        console.error(error);

    }

}

// ----------------------------
// テーブル表示
// ----------------------------

function renderTable(list) {

    table.innerHTML = "";

    songCount.textContent = `全${list.length}曲`;

    list.forEach(song => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${song.title}</td>
            <td>${song.unit}</td>
            <td>${song.category}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="icon-button detail-button"
                        data-id="${song.id}">
                        👁️
                    </button>

                    <button
                        class="icon-button edit-button"
                        data-id="${song.id}">
                        ✏️
                    </button>

                    <button
                        class="icon-button delete-button"
                        data-id="${song.id}">
                        🗑️
                    </button>

                </div>

            </td>
        `;

        table.appendChild(row);

    });

    registerButtons();

}
// ----------------------------
// 検索
// ----------------------------

function searchSongs() {

    const keyword = searchInput.value.toLowerCase();

    const unit = document.getElementById("unitFilter").value;

    filteredSongs = songs.filter(song => {

        const matchKeyword =

            song.title.toLowerCase().includes(keyword)

            ||

            song.unit.toLowerCase().includes(keyword)

            || 
            (song.members &&
            song.members.some(member =>
                member.toLowerCase().includes(keyword)
            ))

        const matchUnit =

            unit === "" ||

            song.unit === unit;

        return matchKeyword && matchUnit;

    });

    renderTable(filteredSongs);

}

// ----------------------------
// ユニットフィルター生成
// ----------------------------

function createUnitFilter() {

    const toolbar = document.querySelector(".toolbar");

    const select = document.createElement("select");

    select.id = "unitFilter";

    select.innerHTML = `<option value="">全ユニット</option>`;

    const units = [...new Set(songs.map(song => song.unit))];

    units.sort();

    units.forEach(unit => {

        const option = document.createElement("option");

        option.value = unit;

        option.textContent = unit;

        select.appendChild(option);

    });

    toolbar.insertBefore(select, document.getElementById("addButton"));

    select.addEventListener("change", searchSongs);

}

// ----------------------------
// イベント
// ----------------------------

searchInput.addEventListener("input", searchSongs);

// ----------------------------

loadSongs();

function registerButtons(){


    // 詳細ボタン
    document.querySelectorAll(".detail-button")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const id =
            Number(button.dataset.id);


            openDetail(id);


        });


    });



    // 編集ボタン
    document.querySelectorAll(".edit-button")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const id =
            Number(button.dataset.id);


            editSong(id);


        });


    });



    // 削除ボタン
    document.querySelectorAll(".delete-button")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const id =
            Number(button.dataset.id);


            deleteSong(id);


        });


    });


}

function editSong(id){

    const song = songs.find(song=>song.id===id);

    console.log("編集",song);

}

function deleteSong(id){

    const result = confirm("この楽曲を削除しますか？");

    if(!result) return;

    songs = songs.filter(song=>song.id!==id);

    filteredSongs = [...songs];

    renderTable(filteredSongs);

}

function openDetail(id){

    location.href =
    `detail.html?id=${id}`;

}
