const data = arrayForGraphDay;

const stage = document.getElementById('stage');
const chart = new CanvasJS.Chart(stage, {
    title: {
        text: "サンプルチャート" //グラフタイトル
    },
    theme: "theme4", //テーマ設定
    data: [{
        type: 'line', //グラフの種類
        dataPoints: data //表示するデータ
    }]
});
chart.render();

const pieChartArr = [];
budgetData.forEach((element, index) => {
    const eacharr = [];
    eacharr["y"] = element["budgetValue"];
    eacharr["indexLabel"] = element["summary"];
    pieChartArr.push(eacharr);
});

const pie = document.getElementById('pie');
const piechart = new CanvasJS.Chart(pie, {
    title: {
        text: "サンプルチャート" //グラフタイトル
    },
    theme: "theme4", //テーマ設定
    data: [{
        type: 'pie', //グラフの種類
        dataPoints: pieChartArr //表示するデータ
    }]
});
piechart.render();