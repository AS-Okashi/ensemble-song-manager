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

            song.unit.toLowerCase().includes(keyword);

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
