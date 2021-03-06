$(function () {
    var vm = new Vue({
        el: '#app',
        data: {
            paperid: '',
            paper: '',
            anslist: '',
            illulist: '',
            answer_content: '',
            stuid_to_show: '',
            answer_to_show: '',
            flag: false
        },
        methods: {
            showans: function (stuid, answer_str) {
                console.log(answer_str);
                answer_json = JSON.parse(answer_str);
                console.log(answer_json.answer_list);
                this.stuid_to_show = stuid;
                this.answer_to_show = answer_json.answer_list;
                html = '';
                for (i = 0; i < answer_json.answer_list.length; i++) {
                    console.log(answer_json.answer_list[i]);
                    html += '<tr>';
                    html += '<td>' + answer_json.answer_list[i].id + '</td>';
                    if (answer_json.answer_list[i].type == "keguan") {
                        html += '<td>客观题</td>';
                    } else {
                        html += '<td>主观题</td>';
                    }

                    html += '<td>' + answer_json.answer_list[i].point + '</td>';
                    html += '<td>' + answer_json.answer_list[i].answer + '</td>';
                    html += '</tr>';
                }
                document.getElementById("show_record").innerHTML = html;
                console.log(html);
                show_div();
            },
            delans: function (stuid) {
                postdata = {
                    action: 'delans',
                    paperid: this.paperid,
                    stuname: stuid
                };
                this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
                    .then(function (res) {
                        console.log(res.bodyText);
                        var dataret = JSON.parse(res.bodyText);
                        if (dataret.code == 200) {
                            alert('删除成功');
                            location.reload();
                        } else {
                            alert('删除学生提交记录失败(1)');
                            location.reload();
                        }
                    }, function (res) {
                        console.log(res.status);
                        alert('删除学生提交记录失败(2)');
                    });
            },
            get_paper_detail: function () {
                this.$http.get(backend_server + 'paper-get-detail/?id=' + this.paperid, {credentials: true})
                    .then(function (res) {
                        console.log(res.bodyText);
                        var dataret = JSON.parse(res.bodyText);
                        if (dataret.code == 200) {
                            this.paper = dataret.info;
                        } else {
                            this.prolist = '获取试题列表失败(1)';
                        }
                    }, function (res) {
                        console.log(res.status);
                        this.prolist = '获取试题列表失败(2)';
                    });
            },
            get_student_answers: function () {
                postdata = {
                    action: 'getans',
                    paperid: this.paperid
                };
                this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
                    .then(function (res) {
                        console.log(res.bodyText);
                        var dataret = JSON.parse(res.bodyText);
                        if (dataret.code == 200) {
                            this.anslist = dataret.anslist;
                            this.illulist = dataret.illulist;
                            console.log(dataret.anslist);
                            console.log(dataret.illulist);
                        } else {
                            this.prolist = '获取试题列表失败(1)';
                        }
                    }, function (res) {
                        console.log(res.status);
                        this.prolist = '获取试题列表失败(2)';
                    });
            },

            submit_grade: function () {
                postdata = {
                    action: 'submit',
                    paperid: this.paperid,
                };
                this.$http.post(backend_server + 'judge-manage/', postdata, {credentials: true})
                    .then(function (res) {
                        console.log(res.bodyText);
                        var dataret = JSON.parse(res.bodyText);
                        if (dataret.code == 200) {
                            alert('成绩提交成功');
                            location.reload();
                        } else {
                            alert('成绩提交失败(1)');
                        }
                    }, function (res) {
                        console.log(res.status);
                        alert('成绩提交失败(2)');
                    });
            },
            illustrate: function () {
                var doughnutPieData = {
                    datasets: [{
                        data: this.illulist,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                    }],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: [
                        '不及格',
                        '60-70分',
                        '70-80分',
                        '80-90分',
                        '90-100分'
                    ],

                };

                var doughnutPieOptions = {
                    responsive: true,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                };


                var gradeChart1Canvas = $("#gradeChart1").get(0).getContext("2d");
                console.log(this.illulist);
                var gradeChart1 = new Chart(gradeChart1Canvas, {
                    type: 'pie',
                    data: doughnutPieData,
                    options: doughnutPieOptions
                });
                this.illustrate2();
            },
            illustrate2:function(){

                var bardata = {
                      labels: [
                        '不及格',
                        '60-70分',
                        '70-80分',
                        '80-90分',
                        '90-100分'
                    ],

                     datasets: [{
                    label: '人数',
                    data: this.illulist,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    fill: false
                }]
            };

                    var options = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }

                };


                if ($("#gradeChart2").length) {
                    var barChartCanvas = $("#gradeChart2").get(0).getContext("2d");
                    // This will get the first returned node in the jQuery collection.
                    var barChart = new Chart(barChartCanvas, {
                        type: 'bar',
                        data: bardata,
                        options: options
                    });
                }

            },

            paper_export: function () {
                postdata = {
                    paperid: this.paper.pid,
                    action: 'export'
                };
                this.$http.post(backend_server + 'paper-export/', postdata, {credentials: true})
                    .then(function (res) {
                        console.log(res.bodyText);
                        var dataret = JSON.parse(res.bodyText);
                        if (dataret.code == 200) {
                            //console.log(this.prolist);
                            alert('导出成绩成功');
                            document.getElementById("sp").click();
                        } else {
                            alert('导出成绩失败（1）');
                            //location.reload();
                        }
                    }, function (res) {
                        console.log(res.status);
                        alert('导出成绩失败（2）');
                        //location.reload();
                    });
            },
            page_print: function () {
                print();
            }
        },

        created: function () {
            this.paperid = getQueryString('paperid');
            console.log(this.paperid);
            this.get_paper_detail();
            this.get_student_answers();
            this.illustrate();
        }
    });
    // $("#show_pie").click(function () {
    //
    // });
});
