var vm = new Vue({
    el: '#app',
    data: {
        paper: {
            pid: 0,
            pname: '',
            teaname: '',
            penabled: ''
        },
        newpro: {
            problem: '',
            ptype: '',
            point: '',
            right: '',
            wrong1: '',
            wrong2: '',
            wrong3: ''
        },
        storeprolist:'',
        prolist: '',
        paperid: 0,
        storeid: '',
        subject: '',
        auto:{
            storeid:'',
            ks: 0,
            km: 0,
            kh: 0,
            zs: 0,
            zm: 0,
            zh: 0,
            kp: 0,
            zp: 0
        },

        modify_param:
        {
            storeid:'',
            modify_index:0,
            modify_type:'',
            modify_degree:'',
            modify_no:0
        },
        modify_list:''

    },
    methods: {

        auto_paper:function()
        {
            this.auto.storeid = this.storeid;
            this.$http.post(backend_server + 'auto-paper/', this.auto, {credentials: true})
                .then(function(res){

                     var dataret = JSON.parse(res.bodyText);
                     if(dataret.code == 200)
                     {
                          alert('自动生成试卷成功');
                          this.get_paper_detail(dataret.prolist);
                          console.log(dataret.prolist);
                          //this.storeprolist.question_list[0].problem = '123';
                     }
                     else {
                         alert('自动生成试卷失败');
                     }
                     hide_div('load','over_load');
                })
        },
        save:function()
        {
            postdata = {
                paperid: this.paperid,
                prolist: this.prolist,
                storeid: this.storeid,
            };

            this.$http.post(backend_server + 'auto-save/', postdata, {credentials: true})
                .then(function(res){

                     var dataret = JSON.parse(res.bodyText);
                     if(dataret.code == 200)
                     {
                          alert('保存成功');
                          window.location.href = "paper-problem.html?paperid=" + this.paperid;
                     }
                     else {
                         alert('保存失败');
                     }
                     hide_div('load','over_load');
                })
        },
        query:function()
        {
            this.modify_param.storeid = this.storeid;
            this.$http.post(backend_server + 'modify-pro/', this.modify_param, {credentials: true})
                .then(function(res){
                     var dataret = JSON.parse(res.bodyText);
                     this.modify_list = dataret.prolist;
                     var count =0;
                     if(dataret.code == 200)
                     {

                         var tabledata = " <table class=\"table table-hover\">" +
                              "<thead><tr>\n" +
                              "            <th width='10%'>序号</th>\n" +
                              "            <th width='43%'>题目</th>\n" +
                              "            <th width='43%'>答案</th>\n" +
                              "          </tr></thead>";
                          tabledata += "<tbody>";
                          tabledata += "<tr>";

                          for (var i=0; i<3; i++)
                          {
                            tabledata += "<td>";
                            tabledata += "<label><input type=\"radio\" name=\"choice\" value=\""+i+"\" v-model='modify_param.modify_no'>"+i+"</label>";
                            tabledata += "</td>";

                            tabledata += "<td>";
                            tabledata +=  this.modify_list[i].problem;
                            tabledata += "</td>";

                            tabledata += "<td>";
                            tabledata +=  this.modify_list[i].right;
                            tabledata += "</td>";
                            tabledata += "</tr><tr>";
                            // if ((i + 1) % 8 == 0)
                            // {
                            //   tabledata += "</div></td></tr><tr><td>";
                            //   tabledata += "<div class=\"btn-group\" role=\"group\" aria-label=\"Basic example\">";
                            // }
                          }
                          tabledata += "</tr>";
                          tabledata += "</tbody>";
                          tabledata += "<table>";
                          $("#mod_pro").html(tabledata);
                     }
                     else {
                         alert('搜索失败');
                     }
                })
        },
        remove: function (id_to_del) {
            console.log(id_to_del);
            this.prolist[id_to_del].valid= false;
            console.log(this.prolist[id_to_del]);
        },
        show_modify: function (index) {
            this.modify_param.modify_index =  index;
            show_div('modify','end_modify');
        },
        modify: function()
        {
            var a =document.getElementsByName('choice');
            var num =0;
            for(var i=0;i<a.length;i++)
            {
               if(a[i].checked)
               {
                   num = i;
                   break;
               }
            }
            this.alter_val(this.modify_param.modify_index,this.modify_list[num]);
            console.log(this.prolist);
            hide_div('modify','end_modify');
        },
        alter_val:function (id,vol) {
            this.prolist[id].id = id;
            this.prolist[id].problem  = vol.problem;
            this.prolist[id].type = vol.type;
            this.prolist[id].right = vol.right;
            this.prolist[id].wrong1 = vol.wrong1;
            this.prolist[id].wrong2 = vol.wrong2;
            this.prolist[id].wrong3 = vol.wrong3;
            this.prolist[id].lastTime = vol.lastTime;
            this.prolist[id].point = vol.point;
            this.prolist[id].degree = vol.degree;
            this.prolist[id].valid = 'true';
        }
        ,
        insert: function (id_to_add) {
            // Bug fix: Reload point field to integer
            var index = parseInt(id_to_add);
            console.log(this.storeprolist.question_list[index-1]);
            var length = parseInt(this.prolist.length);

            var temp = {id : 0,problem :'',type:'',right:'',wrong1:'',wrong2:'',wrong3:'',lastTile:'',point:'',degree:'',valid:''};
            this.prolist.push(temp);
            this.alter_val(length,this.storeprolist.question_list[index-1])

        },
        reset: function () {
            this.newpro = {
                problem: '',
                ptype: '',
                point: '',
                right: 0,
                wrong1: '',
                wrong2: '',
                wrong3: ''
            };
            console.log(this.newpro);
        },
        get_store_detail: function ( ) {
            this.$http.get(backend_server + 'store-get-detail/?storeid=' + this.storeid, {credentials: true})

                .then(function (res) {
                    console.log(res.bodyText);
                    var dataret = JSON.parse(res.bodyText);
                    if (dataret.code == 200) {

                        this.subject = dataret.subject;
                        this.storeprolist = dataret.paper;
                        console.log(this.storeprolist)
                    } else {
                        this.storeprolist = '获取试题列表失败(1)';
                    }
                }, function (res) {
                    console.log(res.status);
                    this.storeprolist = '获取试题列表失败(2)';
                });
        },
        get_paper_detail: function (prolist) {
                        this.prolist = prolist;
        }
    },

    created: function () {
        this.paperid = getQueryString('paperid');

        this.storeid = getQueryString('storeid');
        //console.log(this.paperid);
        //console.log(this.storeid);
        this.get_store_detail();
    }
});



