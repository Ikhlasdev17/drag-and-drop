const modulesContainerEl = document.querySelector('#modules-container')
const moduleFormEl = document.querySelector('#module-form')
const moduleInputEl = document.querySelector('#module-input')

let dragStartedUserId = null
let dragEnteredModuleId = null

let modules = [
	{ id: 1, name: 'First module' },
	{ id: 4, name: 'Last module' },
]

let users = [
	{ id: 1, fullName: 'John Doe', moduleId: 1 },
	{ id: 2, fullName: 'Ikhas Aralbaev', moduleId: 4 },
]

function renderModules(modulesArray = []) {
	modulesContainerEl.innerHTML = ''

	modulesArray.map(item => {
		modulesContainerEl.innerHTML += `
      <!-- module -->
      <div 
        ondragover="event.preventDefault()" 
        ondragenter="onDragEnter(${item.id})" 
        ondragleave="onDragLeaved(${item.id})"
        ondrop="onDrop(${item.id})"
        id='module-${item.id}'
        class='w-[320px] min-w-[320px] max-w-[320px] border border-[rgba(255,255,255,0.2)] rounded-md p-2 bg-gray-300 bg-opacity-30 backdrop-filter backdrop-blur-sm'>

        <!-- module header -->
        <header class='w-full bg-indigo-500 rounded-md px-3 py-2 flex justify-between items-center text-white'>
          <h2>${item.name}</h2>

          <div class='flex items-center gap-2'>
            <i onclick="deleteModule(${item.id})" class='bx bx-trash-alt cursor-pointer'></i>
            <i onclick="addNewUser(${item.id})" class='bx bx-plus-circle cursor-pointer'></i>
          </div>
        </header>

        <!-- divider -->
        <div class='w-full h-[1px] bg-gray-500 my-2 bg-opacity-20'></div>

        <!-- users container -->

        <div ondragover="event.preventDefault()" id='users-container'>
          
        </div>

      </div>
    `
	})

	renderUsers(users)
}

function renderUsers(usersArray = []) {
	usersArray.map(item => {
		const currentUserModuleEl = document.querySelector(
			`#module-${item.moduleId} #users-container`
		)

		currentUserModuleEl.innerHTML += `
      <!-- user -->
      <div
        id="user-${item.id}"
        draggable="true"
        ondragstart="dragStarted(${item.id})"
        ondragend="dragEnded(${item.id})"
        class='p-2 rounded-md flex justify-between items-center bg-white cursor-pointer hover:bg-slate-50 px-3 mb-2'>
        <h2 class='text-slate-700 hover:text-blue-500'>
          ${item.fullName}
        </h2>

        <i onclick="deleteUser(${item.id})" class='bx bx-trash-alt text-red-500'></i>
      </div>
    `
	})
}

function addModule(event) {
	event.preventDefault()

	const newModule = {
		id: Date.now(),
		name: moduleInputEl.value,
	}

	modules.push(newModule)
	renderModules(modules)
	moduleInputEl.value = ''
}

function deleteModule(id) {
	const isConfirm = confirm('Do you want delete this module?')

	if (isConfirm) {
		modules = modules.filter(item => item.id !== id)

		users = users.filter(item => item.moduleId !== id)

		renderModules(modules)
		Swal.fire({
			title: 'Module deleted successfull!',
			icon: 'success',
		})
	}
}

function addNewUser(moduleId) {
	const username = prompt('Enter new user name:')

	const newUserData = {
		id: Date.now(),
		fullName: username,
		moduleId: moduleId,
	}

	users.push(newUserData)
	renderModules(modules)
	Swal.fire({
		title: 'New user added successfully!',
		icon: 'success',
	})
}

function deleteUser(userId) {
	const isConfirm = confirm('Do you want delete this user?')

	if (isConfirm) {
		users = users.filter(item => item.id !== userId)
		renderModules(modules)
		Swal.fire({
			title: 'User deleted successfully!',
			icon: 'success',
		})
	}
}

function dragStarted(userId) {
	dragStartedUserId = userId
	setTimeout(() => {
		document.querySelector(`#user-${userId}`).classList.add('hidden')
	}, 0)
}

function dragEnded() {
	document
		.querySelector(`#user-${dragStartedUserId}`)
		.classList.remove('hidden')
	document
		.querySelector(`#module-${dragEnteredModuleId}`)
		.classList.remove('bg-white')
}

function dragOver(event) {
	event.preventDefault()
}

function onDragEnter(moduleId) {
	dragEnteredModuleId = moduleId

	document.querySelector(`#module-${moduleId}`).classList.add('bg-white')
}

function onDragLeaved(moduleId) {
	document.querySelector(`#module-${moduleId}`).classList.remove('bg-white')
}

function onDrop(moduleId) {
	users = users.map(item => {
		if (item.id === dragStartedUserId) {
			return {
				...item,
				moduleId: moduleId,
			}
		} else {
			return item
		}
	})

	renderModules(modules)
}

renderModules(modules)

moduleFormEl.addEventListener('submit', addModule)
