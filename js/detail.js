// ============================
// Ensemble Song Manager
// detail.js
// ============================


const params =
new URLSearchParams(location.search);



const id =
Number(params.get("id"));



async function loadDetail(){


    try{


        const response =
        await fetch("data/songs.json");



        const songs =
        await response.json();



        const song =
        songs.find(song=>song.id===id);



        if(!song){

            document.getElementById("songTitle")
            .textContent =
            "楽曲が見つかりません";

            return;

        }



        displaySong(song);



    }
    catch(error){

        console.error(error);

    }


}




function displaySong(song){



    document.getElementById("songTitle")
    .textContent =
    song.title;



    document.getElementById("unit")
    .textContent =
    song.unit;



    document.getElementById("category")
    .textContent =
    song.category;



    document.getElementById("members")
    .textContent =
    song.members.join(" / ");



    document.getElementById("album")
    .textContent =
    song.album || "未登録";



    document.getElementById("event")
    .textContent =
    song.event || "未登録";



    document.getElementById("releaseDate")
    .textContent =
    song.releaseDate || "未登録";


}



loadDetail();
