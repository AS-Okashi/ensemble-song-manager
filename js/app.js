// ============================
// Ensemble Song Manager
// app.js
// ============================


const GAS_URL =
"https://script.google.com/macros/s/AKfycbyVX0bPRZG3E2GCGJ1xHgKOifPy5QeWvDvlrvf7SlxNMPcCBLKJhmQK1LJpBgrtLRQ/exec";


let songs = [];
let filteredSongs = [];


let table;
let searchInput;
let songCount;


// ============================
// JSON取得
// ============================

async function loadSongs(){

    try{

        console.log("読み込み開始");


        const response =
        await fetch(GAS_URL);


        console.log("GAS取得成功");


        songs =
        await response.json();


        console.log("取得データ",songs);



        filteredSongs =
        [...songs];


        renderTable(filteredSongs);


        createUnitFilter();


    }
    catch(error){

        console.error(error);

    }

}



// ============================
// 表示
// ============================

function renderTable(list){


    console.log(
        "renderTable実行",
        list
    );


    table.innerHTML="";


    songCount.textContent =
    `全${list.length}曲`;



    list.forEach(song=>{


        const row =
        document.createElement("tr");



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



// ============================
// 検索
// ============================


function searchSongs(){


    const keyword =
    searchInput.value.toLowerCase();



    const unit =
    document.getElementById("unitFilter").value;



    filteredSongs =
    songs.filter(song=>{


        const matchKeyword =

        song.title.toLowerCase()
        .includes(keyword)

        ||

        song.unit.toLowerCase()
        .includes(keyword)

        ||

        (
            song.members &&
            song.members.some(member=>
                member.toLowerCase()
                .includes(keyword)
            )
        );



        const matchUnit =

        unit === ""

        ||

        song.unit === unit;



        return (
            matchKeyword &&
            matchUnit
        );


    });



    renderTable(filteredSongs);


}




// ============================
// ユニットフィルター
// ============================


function createUnitFilter(){


    // 二重生成防止

    if(
        document.getElementById("unitFilter")
    ){

        return;

    }



    const toolbar =
    document.querySelector(".toolbar");



    const select =
    document.createElement("select");



    select.id =
    "unitFilter";



    select.innerHTML =
    `
    <option value="">
    全ユニット
    </option>
    `;



    const units =
    [
        ...new Set(
            songs.map(song=>song.unit)
        )
    ];



    units.sort();



    units.forEach(unit=>{


        const option =
        document.createElement("option");



        option.value =
        unit;



        option.textContent =
        unit;



        select.appendChild(option);


    });



    toolbar.insertBefore(
        select,
        document.getElementById("addButton")
    );



    select.addEventListener(
        "change",
        searchSongs
    );


}



// ============================
// 初期化
// ============================


window.addEventListener(
"DOMContentLoaded",
()=>{


    table =
    document.getElementById(
        "songTable"
    );


    searchInput =
    document.getElementById(
        "searchInput"
    );


    songCount =
    document.getElementById(
        "songCount"
    );



    searchInput.addEventListener(
        "input",
        searchSongs
    );



    setupAddModal();



    loadSongs();


});



// ============================
// ボタン登録
// ============================


function registerButtons(){



    document
    .querySelectorAll(".detail-button")
    .forEach(button=>{


        button.onclick=()=>{


            openDetail(
                Number(button.dataset.id)
            );


        };


    });





    document
    .querySelectorAll(".edit-button")
    .forEach(button=>{


        button.onclick=()=>{


            editSong(
                Number(button.dataset.id)
            );


        };


    });





    document
    .querySelectorAll(".delete-button")
    .forEach(button=>{


        button.onclick=()=>{


            deleteSong(
                Number(button.dataset.id)
            );


        };


    });


}



// ============================
// 編集
// ============================


function editSong(id){


    const song =
    songs.find(
        song=>song.id===id
    );


    console.log(
        "編集",
        song
    );


}



// ============================
// 削除（現在は画面のみ）
// ============================


function deleteSong(id){


    const result =
    confirm(
        "この楽曲を削除しますか？"
    );


    if(!result)
    return;



    songs =
    songs.filter(
        song=>song.id!==id
    );



    filteredSongs =
    [...songs];



    renderTable(
        filteredSongs
    );


}




// ============================
// 詳細
// ============================


function openDetail(id){


    location.href =
    `detail.html?id=${id}`;


}



// ============================
// 追加モーダル
// ============================


function setupAddModal(){


    const addModal =
    document.getElementById(
        "addModal"
    );


    const addButton =
    document.getElementById(
        "addButton"
    );


    const closeModal =
    document.getElementById(
        "closeModal"
    );


    const saveButton =
    document.getElementById(
        "saveSong"
    );



    if(
        !addModal ||
        !addButton
    ){

        return;

    }



    addButton.onclick=()=>{


        addModal.style.display =
        "flex";


    };



    closeModal.onclick=()=>{


        addModal.style.display =
        "none";


    };



    saveButton.onclick =
    saveNewSong;


}



// ============================
// 追加処理
// ============================


async function saveNewSong(){



    const newSong = {


        title:
        document
        .getElementById("songTitle")
        .value,


        unit:
        document
        .getElementById("songUnit")
        .value,


        category:
        document
        .getElementById("songCategory")
        .value,


        members:
        document
        .getElementById("songMembers")
        .value
        .split(","),



        album:
        document
        .getElementById("songAlbum")
        .value,


        event:
        document
        .getElementById("songEvent")
        .value,


        releaseDate:
        document
        .getElementById("songReleaseDate")
        .value


    };



    try{


        const response =
        await fetch(
            GAS_URL,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "text/plain"
                },

                body:
                JSON.stringify(newSong)

            }
        );



        const result =
        await response.json();



        if(result.success){


            alert(
                "楽曲を追加しました"
            );



            document
            .getElementById("addModal")
            .style.display =
            "none";



            clearAddForm();



            loadSongs();


        }


    }
    catch(error){


        console.error(error);


        alert(
            "追加に失敗しました"
        );


    }


}



// ============================
// 入力クリア
// ============================


function clearAddForm(){


    [
        "songTitle",
        "songUnit",
        "songCategory",
        "songMembers",
        "songAlbum",
        "songEvent",
        "songReleaseDate"

    ]
    .forEach(id=>{


        document
        .getElementById(id)
        .value="";


    });


}
