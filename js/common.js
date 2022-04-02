function todoList(){
	//обЪект для хранения элементов списка
	let elem={
		addInput:document.getElementsByTagName("input")[0],  
		ul:document.getElementsByTagName("ul")[0],
		modal:document.querySelector('.modalWindow'),
	};
	//создаем объект для хранения данных в localStorage,
	//проверяем наличие localStorage
	let objItems=localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : {};
	if(Object.keys(objItems).length != 0){
		document.querySelector('.button_clear').classList.remove('invis');
	}
	//создаем в localStorage ключ под которым будем хранить объект
	//с данными, переводим его в json
	localStorage.setItem('items', JSON.stringify(objItems));
	//получаем объект из хранилища парсим в переменную data
	const data = JSON.parse(localStorage.getItem('items'));

	//сохраняем в localStorage элементы checked
	let arrCheck=localStorage.getItem('checked') ? JSON.parse(localStorage.getItem('checked')) : [];
	localStorage.setItem('checked', JSON.stringify(arrCheck));
	const dataCheck = JSON.parse(localStorage.getItem('checked'));


	
	//Создать пункт списка
	let creatListItem=()=>{
		elem.listItem = document.createElement('li');
		elem.listItem.className='listItem';
		elem.checkbox=document.createElement('input');
		elem.checkbox.type='checkbox';
		elem.textTodo=document.createElement('div');
		elem.textTodo.className='textTodo';
		elem.removeButton=document.createElement('button');
		elem.removeButton.className='button button_remove button__red';
		elem.removeButton.innerHTML='Remove'
		elem.label = document.createElement('label');
		elem.listItem.prepend(elem.checkbox, elem.textTodo, elem.removeButton, elem.label);
	}
	//Создать блок редактирования
	let creatUpdateItem=()=>{
		elem.updateItem = document.createElement('div');
		elem.updateItem.className='updateItem';
		elem.updateTodo=document.createElement('input');
		elem.updateTodo.type='text';
		elem.updateTodo.autofocus='autofocus';
		elem.cancelButton=document.createElement('button');
		elem.cancelButton.className='button button_cancel button__red';
		elem.cancelButton.innerHTML='Cancel'
		elem.updateButton=document.createElement('button');
		elem.updateButton.className='button  button_update button__green';
		elem.updateButton.innerHTML='Update'
		elem.updateItem.prepend(elem.updateTodo, elem.cancelButton, elem.updateButton);
	}
  	
	

	//Добавить пункт в список
	let liMaker=(x)=>{
		elem.ul.prepend(elem.listItem);
		elem.textTodo.innerHTML=x;
		elem.checkbox.id=elem.listItem.key;
		elem.label.setAttribute('for', elem.listItem.key);
		

	}
	//собирает пункт меню
	let createTodo=()=>{
		val=elem.addInput.value;
    	    //проверка на пустую строку
    	if (!/^\s+$/.test(val) && val!==''){
		    //генерируем ключи для элементов, чтобы связать их с хранилищем
		    elem.listItem.key='n'+(Math.floor(Math.random()*10000));
			//записываем св-во в objItems с ключем id
			objItems[elem.listItem.key]=val;
			if(Object.keys(objItems).length > 1){
			document.querySelector('.button_clear').classList.remove('invis');
			}

			liMaker(val);
			//добавляем свойство в localStorage
			localStorage.setItem('items', JSON.stringify(objItems))

			//очищаем инпут
			elem.addInput.value='';
		}
		else {
        	//в случае пустой строки...
        	let timerId = setInterval(() => {elem.addInput.classList.contains('redPlac')? elem.addInput.classList.remove('redPlac') : elem.addInput.classList.add('redPlac')}, 300);
        	setTimeout(() =>{clearInterval(timerId); timerId = null;}, 1900);
        }
    };
	
    //Удалить пункт из списка
	let removeTodo=(e)=>{
		//удаляем свойства из хранилища
		let targetKey=e.target.parentNode.key;
		delete objItems[targetKey];
		localStorage.setItem('items', JSON.stringify(objItems));
		
		arrCheck=arrCheck.filter((curVal) => curVal!=targetKey);
	    localStorage.setItem('checked', JSON.stringify(arrCheck));

	    if(Object.keys(objItems).length < 2){
			document.querySelector('.button_clear').classList.add('invis');
			}
		e.target.closest('li').remove();
	};


	//Редактировать пункт списка
	let cancelEdit;//создаем переменные для функций, чтобы использовать
	let updateText;// их потом вне блока
	
	let editTodo=(e)=>{
		let target=e.target;
		//если элемент checked, он не редактируется
		if(target.previousSibling.checked){
			return
		}

		{	//функция очистки, удаляет блок редактирования
			cancelEdit=()=>{
				for(let li of document.querySelectorAll('.listItem')){
					li.classList.remove('invis');
				}
				for(let update of document.querySelectorAll('.updateItem')){
					update.remove();
				}
			};
			//собираем блок редактирования по месту клика
			cancelEdit();
			let val=target.innerHTML;
			elem.updateTodo.value=val;
			elem.updateTodo.autofocus='autofocus';
			target.parentNode.after(elem.updateItem);
			target.parentNode.classList.add('invis');
		}
		//заменяем  старый текст на отредактированный
		updateText=()=>{
			let newVal=elem.updateTodo.value;
			target.innerHTML=newVal;
			//обновляем свойство в хранилище
			let targetKey=e.target.parentNode.key;
			objItems[targetKey]=newVal;
			localStorage.setItem('items', JSON.stringify(objItems));
			//console.log(objItems[targetKey], targetKey);

			cancelEdit();
		};

	};
	
	//выводит данные из localStorage при перезагрузке
	for (let item in data){
		 creatListItem();
		 liMaker(data[item]);
		 elem.listItem.key=item;
		 elem.checkbox.id=item;
		 elem.label.setAttribute('for', item);

		 //отмечает  checked элементы
		 for (let key of dataCheck){
			if(item==key){
  			elem.checkbox.checked="checked";

  			}
		}
	}
		
	
	//слушатели событий
	document.querySelector(".main").addEventListener(
	'click', (e)=>{
		
		if (e.target.classList.contains('button_add')){
			creatListItem();
			createTodo();

		}
		if(e.target.classList.contains('button_remove')){
			removeTodo(e);
		}
		if(e.target.classList.contains('textTodo')){
			creatUpdateItem();
			editTodo(e);
		}
		if(e.target.classList.contains('button_cancel')){
			cancelEdit();
		}
		if(e.target.classList.contains('button_update')){
			updateText();
		}
		if(e.target.classList.contains('button_clear')){
			elem.modal.classList.remove('invis');
		}
		if(e.target.classList.contains('button_modalDelete')){
			elem.modal.classList.add('invis');
			localStorage.clear();
			objItems={};
			for(let item of document.querySelectorAll('.listItem')){
				item.remove();
			}
			document.querySelector('.button_clear').classList.add('invis');
		}
		if(e.target.classList.contains('button_modalCancel')){
			elem.modal.classList.add('invis');
		}

		if(e.target.type=='checkbox'){
			let targetKey=e.target.parentNode.key;
			if(e.target.checked){
				arrCheck.push(targetKey);
	            localStorage.setItem('checked', JSON.stringify(arrCheck));
			}
			else{
				arrCheck=arrCheck.filter((curVal) => curVal!=targetKey);
	            localStorage.setItem('checked', JSON.stringify(arrCheck));
			}
			
		}
		return
	});
	
	elem.addInput.addEventListener(
		'keydown',(e)=>{if( e.code === 'Enter'){
		creatListItem();
		createTodo();
		
		}
		return
	});

	elem.ul.addEventListener(
		'keydown',(e)=>{
		if( e.code === 'Enter'){
		 updateText();
		}
		if( e.code === 'Escape'){
		 cancelEdit();
		}
		return
	});
};

todoList();


function changeBG(){
	let varBG=[
		null,
		'url(img/bg_640.png)',
		'url(img/bg_6401.jpg)',
		'url(img/bg_6402.png)',
		'url(img/bg-728510.svg)',
		'url(img/bg_6403.png)',
		'url(img/bg-403769.svg)',
		'url(img/bg_6404.png)',
		'url(img/bg_6405.jpg)',
		
	];
	let buttonChange=document.querySelector('.button_change');
	let body=document.querySelector('body');
	let i=0;
	buttonChange.onclick=()=>{
		++i;
		if(i==varBG.length){
			i=0;
		}
		body.style.backgroundImage=varBG[i];
		};
		

};
changeBG();
