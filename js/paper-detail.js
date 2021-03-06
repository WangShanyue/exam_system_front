var vm = new Vue({
  el:'#app',
  data:{
    paper: {
      pid: 0,
      pname: '',
      teaname: '',
      penabled: ''
    },
    newpro:{
      problem: '',
      ptype: '',
      point: '',
      right: '',
      wrong1: '',
      wrong2: '',
      wrong3: ''
    },
    stulist: {
      count: 7,
      stu_list: [
        {"stu": "16001"},
        {"stu": "16002"},
        {"stu": "16003"},
        {"stu": "16004"},
        {"stu": "16005"},
        {"stu": "16006"},
        {"stu": "16007"}
      ],
      stu_info:{}
    },
    batch_names: '',
    prolist : '',
    paperid: 0
  },
  methods:{
    judge:function(paperid){
      window.open("judge.html?paperid=" + paperid);
    },
    remove_name:function(stuname){
      postdata = {
        paperid: this.paper.pid,
        stu_to_del: "" + stuname,
        action: 'delstu'
      };
      this.$http.post(backend_server + 'paper-stulist/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          //console.log(this.prolist);
          alert('删除学生成功');
          location.reload();
        }
        else
        {
          alert('删除学生失败（1）');
          //location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('删除学生失败（2）');
        //location.reload();
      });
    },
    delete_all_names:function(){
      // delete all names from student list
      postdata = {
        paperid: this.paper.pid,
        action: 'cleanstu'
      };
      this.$http.post(backend_server + 'paper-stulist/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          //console.log(this.prolist);
          alert('清空学生名单成功');
          location.reload();
        }
        else
        {
          alert('清空学生名单失败（1）');
          //location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('清空学生名单失败（2）');
        //location.reload();
      });
    },
    batch_insert:function(){
      postdata = {
        stulist: this.batch_names,
        paperid: this.paperid,
        action: 'addstu'
      };
      this.$http.post(backend_server + 'paper-stulist/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          //console.log(this.prolist);
          alert('批量导入学生名单成功');
          location.reload();
        }
        else
        {
          alert('批量导入学生名单失败（1）');
          //location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('批量导入学生名单失败（2）');
        //location.reload();
      });
    },
    remove:function(id_to_del){
      //console.warn(id_to_del + " is to be removed.");
      postdata = {
        action: 'delpro',
        paperid: this.paper.pid,
        problem: id_to_del
      };
      this.$http.post(backend_server + 'paper-prolist/', postdata, {credentials: true})
      .then(function(res){
        //console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          //console.log(this.prolist);
          alert('删除题目成功');
          location.reload();
        }
        else
        {
          alert('删除题目失败（1）');
          //location.reload();
        }
      },function(res){
        console.log(res.status);
        alert('删除题目失败（2）');
        //location.reload();
      });
    },
    modify:function(){
      // NOT confirmed to implement this one
    },
    insert:function(){
      postdata = {
        action: 'addpro',
        paperid: this.paper.pid,
        problem: this.newpro
      };
      console.log(postdata);
      this.$http.post(backend_server + 'paper-prolist/', postdata, {credentials: true})
      .then(function(res){
        console.log(res.bodyText);
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          //console.log(this.prolist);
          alert('新增题目成功');
          location.reload();
        }
        else
        {
          //this.prolist = '获取试题列表失败(1)';
          alert('新增题目失败（1）');
          location.reload();
        }
      },function(res){
        console.log(res.status);
        //this.prolist = '获取试题列表失败(2)';
        alert('新增题目失败（2）');
        location.reload();
      });
    },
    get_paper_detail:function(){
      this.$http.get(backend_server + 'paper-get-detail/?id=' + this.paperid, {credentials: true})
      .then(function(res){
        var dataret = JSON.parse(res.bodyText);
        if (dataret.code == 200)
        {
          this.paper = dataret.info;
          /*this.procount = dataret.paper.problem_count;
          this.prolist = dataret.paper.question_list;*/
          this.prolist = dataret.paper;
          this.stulist = dataret.stulist;
          console.log(this.stulist);
          //console.log(this.prolist);
          this.generate_stutable();
        }
        else
        {
          this.prolist = '获取试题列表失败(1)';
        }
      },function(res){
        console.log(res.status);
        this.prolist = '获取试题列表失败(2)';
      });
    },
    generate_stutable:function(){
      var tabledata = " <table class=\"table table-hover\">" +
          "<thead><tr>\n" +
          "            <th>学号</th>\n" +
          "            <th>姓名</th>\n" +
          "            <th>操作</th>\n" +
          "          </tr></thead>";
      tabledata += "<tbody>";
      tabledata += "<tr>";

      for (var i=0; i<this.stulist.count; i++)
      {
        tmp = this.stulist.stu_list[i].stu;
        tabledata += "<td>";
        tabledata += this.stulist.stu_list[i].stu;
        tabledata += "</td>";

        tabledata += "<td>";
        tabledata += this.stulist.stu_info[i];
        tabledata += "</td>";

        tabledata += "<td>";
        tabledata +="<button type=\"button\" onclick=\"vm.remove_name(\'"+ this.stulist.stu_list[i].stu  +"\')\" class=\"btn btn-rounded btn-inverse-danger btn-sm\" ><i class=\"mdi mdi-delete-forever\"></i> 删除</button>";
        // tabledata += "<input class=\"btn btn-outline-primary btn-sm\" type=\"button\" onclick=\"vm.remove_name(" +
        //  this.stulist.stu_list[i].stu + ")\" value=\"" +
        //  删除+ "\" />";
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
      $("#stutable").html(tabledata);
    },
       upload_stu:function(){
      var form_data = new FormData();
      var file_info = $( '#upload_stulist')[0].files[0];
      form_data.append('file', file_info);
      form_data.append('paperid', this.paperid);
      //form_data.append('paperid', this.paper.pid);
      if(file_info == undefined){
        alert('你没有选择任何文件');
        return;
      }
      $.ajax({
        url: backend_server + 'stu-upload/',
        type:'POST',
        data: form_data,
        processData: false,  // tell jquery not to process the data
        contentType: false, // tell jquery not to set contentType
        success: function(callback) {
          alert('上传成功！');
          location.reload();
        }
      });
    }


  },
  created:function(){
    this.paperid = getQueryString('paperid');
    this.get_paper_detail();
  }

})



