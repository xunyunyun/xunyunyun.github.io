
//                            _ooOoo_  
//                           o8888888o  
//                           88" . "88  
//                           (| -_- |)  
//                            O\ = /O  
//                        ____/`---'\____  
//                      .   ' \\| |// `.  
//                       / \\||| : |||// \  
//                     / _||||| -:- |||||- \  
//                       | | \\\ - /// | |  
//                     | \_| ''\---/'' | |  
//                      \ .-\__ `-` ___/-. /  
//                   ___`. .' /--.--\ `. . __  
//                ."" '< `.___\_<|>_/___.' >'"".  
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |  
//                 \ \ `-. \_ __\ /__ _/ .-` / /  
//         ======`-.____`-.___\_____/___.-`____.-'======  
//                            `=---='  
//  
//         .............................................  
//                  佛祖镇楼                  BUG辟易  
//          佛曰:  
//                  写字楼里写字间，写字间里程序员；  
//                  程序人员写程序，又拿程序换酒钱。  
//                  酒醒只在网上坐，酒醉还来网下眠；  
//                  酒醉酒醒日复日，网上网下年复年。  
//                  但愿老死电脑间，不愿鞠躬老板前；  
//                  奔驰宝马贵者趣，公交自行程序员。  
//                  别人笑我忒疯癫，我笑自己命太贱；  
//                  不见满街漂亮妹，哪个归得程序员？  
function System(){
	//当前显示的项目
	this.activeProjectDOM = null;
	this.activeProjectName = null;
	//项目列表的DOM元素
	this.projectDOM = document.getElementById('projects');
	//添加项目按钮
	this.addProjectBtn = document.getElementsByClassName('add-btn')[0];

	this.addProjectSpan = document.getElementById('add-project');
	//任务栏
	this.projectNameDOM = document.getElementsByClassName('project-name')[0];
	//未完成
	this.todoDOM = document.getElementsByClassName('todo')[0];
	//已完成
	this.doneDOM= document.getElementsByClassName('done')[0];
	//添加任务按钮
	this.addTaskBtn = document.getElementsByClassName('add-btn')[1];
	//添加任务区域
	this.addTaskSpan = document.getElementById('add-task');
	//用户数据
	this.userData = JSON.parse(window.localStorage.getItem('userData'));

	if(!this.userData){
		this.userData = {
			'projects':['个人','工作','休闲','其他杂项'],
			'tasks':{
				'个人':{'todo':[],'done':[]},
				'工作':{'todo':[],'done':[]},
				'休闲':{'todo':[],'done':[]},
				'其他杂项':{'todo':[],'done':[]}
			}
		};
		window.localStorage.setItem('userData',JSON.stringify(this.userData));
	}
}


System.prototype = {
	constructor: System,

	//处理localStorage中数据并实例化对象
	_loadData : function(){
		this.projectList = this.userData['projects'];
		this.tasks = this.userData['tasks'];
		//渲染出左边项目列表
		this._renderProject();


		this.activeProjectDOM = this.projectDOM.children[0];
		this.activeProjectName = this.projectList[0];
		this._setActiveProject();
		
	},

	_renderProject: function(){
		//把项目填充进projectDOM

		//获取该项目下未完成的个数
		
		var innerHTML = '';
		for(var i=0,len=this.projectList.length;i<len;i++){

			var taskNum = this._getTaskNum(this.projectList[i]);
			// 修改***********************************
			var projectName = this.projectList[i];
			if(i==0)innerHTML += '<li><a href="#">'+projectName+'<span>'+taskNum+'</span></li>';
			else {
				innerHTML += '<li><a href="#">'+projectName+'<span>'+taskNum+'</span>'
					+'</a><span class="del-btn">X&nbsp&nbsp</span></li>';
			}
		}

		this.projectDOM.innerHTML = innerHTML;

	},

	_renderTask: function(){
		//当前选中的项目为this.activeProject
		
		//get the projectName
		this.activeTask = this.tasks[this.activeProjectName];
		
		//开始渲染
		this.projectNameDOM.innerHTML = this.activeProjectName;
		//渲染todo
		var innerHTML = '';
		var todoData = this.userData.tasks[this.activeProjectName].todo;
		for(var i=0,len=this.activeTask.todo.length;i<len;i++){
			innerHTML += '<li><input type="checkbox"><a class="clearfix" href="#"><span class="task-name">'
			+this.activeTask.todo[i].task+'</span><ul class="level">';
			for(var j = 0; j < 5; j++){
				if(j < todoData[i].level)
					innerHTML += '<li class="star active"></li>';
				else
					innerHTML += '<li class="star"></li>';
			}
			innerHTML += '</ul><span class="task-date">'+this.activeTask.todo[i].date
			+'</span></a><span class="del-btn">x</span></li>';
		}


		this.todoDOM.innerHTML = innerHTML;


		var todolist = this.userData['tasks'][this.activeProjectName]["todo"];
		var todoDomList = document.getElementsByClassName("todo")[0].childNodes;
		for(var i = 0; i < todolist.length; i++){
			if(new Date(todolist[i]["date"]) < new Date()){
				todoDomList[i].getElementsByClassName("task-date")[0].style.color = "red";
			}
		}


		//渲染done
		innerHTML = '';
		for(var i=0,len=this.activeTask.done.length;i<len;i++){
			innerHTML += '<li><input type="checkbox" checked><a href="#"><span class="task-name">'
			+this.activeTask.done[i].task+'</span><span class="task-date">'+this.activeTask.done[i].date
			+'</span></a><span class="del-btn">x</span></li>';
		}
		this.doneDOM.innerHTML = innerHTML;


	},
	_getTaskNum: function(projectName){
		return this.tasks[projectName].todo.length||0;
	},

	/* 此处会报错，因为在不匹配的情况下，text.match(re)=null，没有text.match(re)[1] */
	/*_getProjectName : function(text){
		var re = /^(.*)<span>\d+<\/span>$/;
		return text.match(re)[1];	
	},*/

	/*
		修改如下：
	*/
	/********************/
	_getProjectName2 : function(text1,text2){
		var re = /^(.*)<span>\d+<\/span>$/;
		if(text1.match(re) !== null){
			return text1.match(re)[1];
		}else if(text2.match(re) !== null){
			return text2.match(re)[1];
		}else {
			return null;
		}
		
	},
	_getProjectName : function(text){
		var re = /^(.*)<span>\d+<\/span>$/;
		if(text.match(re) !== null){
			return text.match(re)[1];
		}else {
			return null;
		}
	},
	/********************/

	_bindUI: function(){
		var that = this;
		
		//左侧项目列表添加点击事件
		addEvent(that.projectDOM,'click',function(e){
			that.activeProjectDOM = e.target.parentElement;

			//that.activeProjectName = that._getProjectName(e.target.innerHTML);
			// that._setActiveProject();
			// e.preventDefault();

			/*
				此处的点击事件分为两种，一种是实现项目切换，另一种是实现项目删除
				不足之处：项目（个人）不能删除，应该在初始化的时候，不给其增加删除按钮;
						  此处，在删除个人时删除时给予提醒。
			*/

			/********************/
			that.activeProjectName = that._getProjectName2(e.target.innerHTML,e.target.parentElement.innerHTML);
			//点击事件是选中项目事件
			if(that.activeProjectName !== null){
				that._setActiveProject();
			}
			//点击事件为删除事件;第一个默认项目不可删除
			else if(e.target.className === 'del-btn'&& that.activeProjectDOM !== that.projectDOM.children[0]){
				if(!confirm("确认删除项目及其下属任务？")) return;
				//删除视图中对应的工程列
		        that.projectDOM.removeChild(that.activeProjectDOM);
		        // 找出对应li的工程名称
		        that.activeProjectName = that._getProjectName(that.activeProjectDOM.getElementsByTagName("a")[0].innerHTML);        
				//删除userData中的数据
				/*****************/
				that.projectList = that.userData['projects'];
				that.taskList = that.userData['tasks'];

				for (var i = 0, len = that.projectList.length; i < len; i++) {
					if (that.projectList[i] === that.activeProjectName) {
						that.projectList.splice(i, 1);						
						delete that.taskList[that.activeProjectName];
						
					}

				}
				//对当前active列重新赋值，为第一个元素, 并刷新右侧显示
		        that.activeProjectDOM = that.projectDOM.children[0];
		        that.activeProjectName = that._getProjectName(that.activeProjectDOM.getElementsByTagName("a")[0].innerHTML);
				that._renderTask();
				// 重新保存数据到本地
				that._saveUserData();
				

			}
			else if(e.target.className === 'del-btn'&& that.activeProjectDOM === that.projectDOM.children[0]){
				alert("个人项目不可删除！");
			}

			e.preventDefault();			
			/********************/

		});
		addEvent(that.addProjectBtn,'click',function(e){
			showElement(that.addProjectSpan,true);
			e.preventDefault();
		});

		addEvent(that.addTaskBtn,'click',function(e){
			showElement(that.addTaskSpan,true);
		});
		//添加项目事件
		addEvent(that.addProjectSpan,'click',function(e){
			if(e.target.className === 'cancel-link'){
				showElement(this,false);
			} else if(e.target.className === 'add-link'){
				//添加渲染并持续化保存项目
				that._addProject();
				for(var i=0;i<this.children.length;i++){
					if(this.children[i]){
						
						this.children[i].value='';
					}
				}
				showElement(this,false);
			}
			e.preventDefault();
		});

		//添加任务事件
		addEvent(that.addTaskSpan,'click',function(e){
			if(e.target.className === 'cancel-link'){
				showElement(this,false);
			} else if(e.target.className === 'add-link'){
				//添加渲染并持续化保存项目
				that._addTask();
				//console.log(this.children);
				for(var i=0;i<this.children.length;i++){
					if(this.children[i]){
						
						this.children[i].value='';
					}
				}
				showElement(this,false);
			}
		});


		/*
			此处的点击事件也有两种效果，完成任务或删除任务
		*/
		addEvent(that.todoDOM,'click',function(e){
			//完成任务事件
			if(e.target.tagName === 'INPUT'){
				var t = e.target.parentNode;
				var taskIndex = Array.prototype.indexOf.call(t.parentNode.childNodes, t);
				//is checked,remove the <li> to the doneDOM
				that.todoDOM.removeChild(e.target.parentElement);
				that.doneDOM.appendChild(e.target.parentElement);
				//删除userData中的数据
				var todoData = that.userData.tasks[that.activeProjectName].todo;
				var doneData = that.userData.tasks[that.activeProjectName].done;
				doneData.push(todoData[taskIndex]);
				todoData.splice(taskIndex, 1);

				that._renderProject();
				that._renderTask();
				that._saveUserData();
			}
			//删除任务事件 
			/************************/
			else if(e.target.className === 'del-btn'){
				var t = e.target.parentNode;
				var taskIndex = Array.prototype.indexOf.call(t.parentNode.childNodes, t);
				var ifDel = confirm("该任务未完成，是否删除？");
				if(!ifDel) return;
				//删除视图中任务的显示
				that.todoDOM.removeChild(e.target.parentElement);
				//删除userData中的数据
				var todoData = that.tasks[that.activeProjectName].todo;
				todoData.splice(taskIndex, 1);
				
				that._renderProject();
				that._saveUserData();

			}
			//设置优先权事件
			else if(e.target.className.match('star')) {
				var level = getIndex(e) + 1; 
				var t = e.target.parentNode.parentNode.parentNode;
				var taskIndex = Array.prototype.indexOf.call(t.parentNode.childNodes, t);
				var todoData = that.tasks[that.activeProjectName].todo;
				todoData[taskIndex].level = level;
				
				that._saveUserData();
				that._renderTask();
			}
		});
		/*
			此处的点击事件也有两种效果，取消完成任务或删除任务
		*/
		addEvent(that.doneDOM,'click',function(e){
			//取消完成事件
			if(e.target.tagName === 'INPUT'){
				//is checked,remove the <li> to the doneDOM
				that.doneDOM.removeChild(e.target.parentElement);
				that.todoDOM.appendChild(e.target.parentElement);
				//删除userData中的数据
				var taskName = e.target.parentElement.getElementsByClassName('task-name')[0].innerHTML;
				var todoData = that.tasks[that.activeProjectName].todo;
				var doneData = that.tasks[that.activeProjectName].done;

				//remove the taskName into done
				for (var i = 0; i < doneData.length; i++) {
					if (doneData[i].task === taskName) {

						todoData.push(doneData[i]);
						doneData.splice(i, 1);
						break;
					}
				}

				that._renderProject();
				that._renderTask();
				that._saveUserData();
			}
			//删除完成任务事件
			/************************/
			else if(e.target.className === 'del-btn'){
				//删除视图中完成任务的显示
				that.doneDOM.removeChild(e.target.parentElement);
				//删除userData中的数据
				var taskName = e.target.parentElement.getElementsByClassName('task-name')[0].innerHTML;	
				var doneData = that.tasks[that.activeProjectName].done;
				for (var i = 0; i < doneData.length; i++) {
					if (doneData[i].task === taskName) {
						doneData.splice(i, 1);
						break;
					}
				}
				that._renderProject();
				that._saveUserData();

			}
			/************************/

		});


	},

	_removeTask : function(){

	},

	_addProject : function(){
		//获取添加的项目名
		var newProjectName = document.querySelector('[name="project-name"]').value.trim();

		if(!newProjectName || newProjectName == ""){
			alert("项目名不能为空！");
			return;
		}
		
		if(this.projectList.indexOf(newProjectName)!==-1) {
			alert('已经存在！请勿重复添加');
			return;
		}
		this.projectList.push(newProjectName);
		this.tasks[newProjectName] = {'todo':[],'done':[]};
		//把新添加的渲染到projectDOM中
		var newProject = document.createElement('li');
		var newLink = document.createElement('a');
		newLink.setAttribute('href','#');
		newLink.innerHTML = newProjectName + '<span>0</span>';

		/*****************************/
		var newSpan = document.createElement('span');
		newSpan.setAttribute('class','del-btn');
		newSpan.innerHTML = "X&nbsp&nbsp";
		/*****************************/
		newProject.appendChild(newLink);
		newProject.appendChild(newSpan);
		this.projectDOM.appendChild(newProject);

		this.activeProjectDOM = newProject;
		this.activeProjectName = newProjectName;
		//设置新增加的项目为active
		this._setActiveProject();
		//持续化保存用户数据
		this._saveUserData();
		

	},

	_addTask: function(){
		var newTaskName = document.querySelector('[name="task-name"]').value.trim();
		var taskDate = document.querySelector('[name="task-date"]').value;
		
		if(!newTaskName || newTaskName == ""){
			alert("任务不能为空！");
			return;
		}
			
		//持续化存储任务数据
		//console.log(this.activeTask);

		this.activeTask.todo.push({'id':this.activeTask.todo.length+1,'level':0, 'task':newTaskName,'date':taskDate});
		this._saveUserData();

		//渲染到DOM中
		this._renderProject();
		this._renderTask();
	},

	_setLevel: function(){
		//获取任务下标

		//获取等级

	},

	_setActiveProject: function(){
		//当前选中的Project 为 this.activeProject
		//首先去掉projectDOM中的active class
		this._resetProject();
		
		addClass(this.activeProjectDOM,'active');
		
		//渲染选中项目下的任务
		this._renderTask();

	},
	_resetProject: function(){
		
		for(var i=0,len=this.projectDOM.children.length;i<len;i++){
			
			removeClass(this.projectDOM.children[i],'active');
		}
	},

	_saveUserData: function(){
		
		window.localStorage.setItem('userData',JSON.stringify(this.userData));
	},


	render: function(){
		this._loadData();
		this._renderProject();
		this._bindUI();

	}

}

