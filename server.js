const express=require("express");
const app=express();

const { MongoClient, Collection }=require("mongodb");

let db;

const url="mongodb+srv://cdmi4613:als303!C@cluster0.erl2y82.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

new MongoClient(url).connect().then(client => {
	console.log("DB connect success.");

	db=client.db("open-source");

	app.listen(8080, () => {
		console.log("http://localhost:8080");
	});
}).catch(error => {
	console.log(error);
});

app.use(express.static(__dirname+"/public")); // public 경로 설정(이미지, 비디오, CSS)
// href="/publiccss/style.css"
app.set("view engine", "ejs"); // views(이름못바꿈) 폴더 EJS 템플릿 사용

const data=[
        {
            title: "Academy",
            path: "academy.png",
            alt: "academy",
            p: "비트코인 비주얼리제이션 워크숍",
            span: "2018.01.21(Sun) / 10:00-17:00"
        },
        {
            title: "Upcoming Project",
            path: "upcoming.png",
            alt: "upcoming",
            p: "Artist Talk Kyle Mcdonald",
            span: "2018.02.23(Fri) / 19:00-21:30"
        },
        {
            title: "Archive",
            path: "archive.png",
            alt: "archive",
            p: "People / Creator Database",
            span: "Workspace-Unlimited"
        }
]

app.get("/", async(request, response) => { // 메인 페이지 연결
    let result=await db.collection("data1").find().toArray();

    if(result.length === 0){ // data1 컬렉션이 만들어지기 전의 조건
        db.collection("data1").insertMany(data); // MongoDB 데이터 입력
        response.send(`
            <script>
                location.reload();
            </script>
        `);
        // window.location.reload(); // UI JavaScript
    }
    else{ // data 컬렉션이 만들어 진 후의 조건
        response.render("index.ejs", {items:result});
    }

   // console.log(result.length); // 0
   // response.render("index.ejs", {items: data})
  // response.send("<p>Main Page</p>");
  response.render("index.ejs", {items: result});
});

// app.listen(8080, () => { // 포트 연결 응답 대기
//     console.log("http://localhost:8080");
// })