let wrapper = document.getElementById('wrapper')
let body = document.querySelector('body')
let active = document.getElementById("focus")
let switcher = document.getElementById('switch')
let skip = document.querySelector('.skip-btn')
let btn = document.querySelectorAll('.btn')

let settings = document.querySelector('.settings')
let closeSettings = document.querySelector('.close-modal')
let modalArea = document.querySelector('.modal-area')
let modalWindow = document.querySelector('.modal-window')

let form = document.getElementById('form')
let submit = document.querySelector('.submit-btn')
let inputs = document.querySelectorAll(".time")
let inputsWrapper = document.querySelectorAll('.change-element')

let addTask = document.querySelector('.add-tasks')
let taskBlock = document.querySelector('.task-block')
let saveBtn = document.getElementById('save')
let closeBtn = document.getElementById('close-task')
let titleTask = document.getElementById('title')
let countInput = document.getElementById('count-tasks')
let upBtn = document.getElementById('up')
let downBtn = document.getElementById('down')

let editFlag = true
let editedBlockId;

let countRuns = 0

let switchButtonSettings = document.querySelectorAll('.switch')
for(let i = 0; i < switchButtonSettings.length; i++)
    switchButtonSettings[i].addEventListener('click', (e) => {
        e.target.classList.toggle('switchOn')
    })


settingsStruct = {
    autoSwitchFocus: false,
    autoSwitchBreak: false,
    autoSwitchTask: false,
    longBreakInterval: 0
}

let count = 0
let autoFocus = document.getElementById('auto-start-focus')
autoFocus.addEventListener('change', () => {
    if(count % 2 == 0)
        autoFocus.value = true
    else autoFocus.value = false
    settingsStruct.autoSwitchFocus = autoFocus.value
    count++
})

count = 0
let autoBreak = document.getElementById('auto-start-break')
autoBreak.addEventListener('change', () => {
    if(count % 2 == 0)
        autoBreak.value = true
    else autoBreak.value = false
    settingsStruct.autoSwitchBreak = autoBreak.value
    count++
})

count = 0
let autoTask = document.getElementById('auto-switch-task')
autoTask.addEventListener('change', () => {
    if(count % 2 == 0)
        autoTask.value = true
    else autoTask.value = false
    settingsStruct.autoSwitchTask = autoTask.value
    count++
})


let breakInterval = document.getElementById('break-interval')
breakInterval.addEventListener('change', () => {
    settingsStruct.longBreakInterval = breakInterval.value
})


themes = [
    {
        theme: 'focus',
        bgBody: '#ba4949',
        bgTimer: '#c15c5c',
        active: true,
        time:
        {
            minutes: '25',
            seconds: '0',
        },
        currentTime:{
            minutes: '25',
            seconds: '0'
        }
    },
    {
        theme: 'shortBreak',
        bgBody: '#38858a',
        bgTimer: '#4c9196',
        active: false,
        time:
        {
            minutes: '5',
            seconds: '0',
        },
        currentTime:{
            minutes: '5',
            seconds: '0'
        }
    },
    {
        theme: 'longBreak',
        bgBody: '#397097',
        bgTimer: '#4d7fa2',
        active: false,
        time:
        {
            minutes: '15',
            seconds: '0',
        },
        currentTime:{
            minutes: '15',
            seconds: '0'
        }
    },
    finishTime = 0
]

tasks = []

function switchTheme(theme){
    body.style.background = theme.bgBody
    wrapper.style.background = theme.bgTimer
    return theme
}

function setTimer(theme){
    if(theme.time.minutes == '')
        theme.time.minutes = 0
    if(theme.time.seconds == '')
        theme.time.seconds = 0
    theme.currentTime.minutes = theme.time.minutes
    theme.currentTime.seconds = theme.time.seconds
    if(theme.active)
    {
        document.getElementById("minutes").innerHTML = theme.time.minutes
        if(theme.time.seconds >= 10)
            document.getElementById("seconds").innerHTML = theme.time.seconds
        else document.getElementById("seconds").innerHTML = '0' + theme.time.seconds
        finishTime = Number(theme.time.minutes) * 60 + Number(theme.time.seconds)
    }
}


function startTimer(currentIndex){
    finishTime--;
    if(finishTime >= 0)
    {
        let minutes = Math.floor( finishTime / 60) % 60
        let seconds = Math.floor( finishTime) % 60
        themes[currentIndex].currentTime.minutes = String(minutes)
        themes[currentIndex].currentTime.seconds = String(seconds)
        document.getElementById("minutes").innerHTML = minutes
        if(seconds >= 10)
            document.getElementById("seconds").innerHTML = seconds
        else document.getElementById("seconds").innerHTML = '0' + seconds
    }
    else{
        stop()
        skipFunc()
        //alert('Time is up')
    }
}



let previous = active
let interval;

document.addEventListener('DOMContentLoaded', () =>{
    setTimer(themes[0])
})

settings.addEventListener('click', () =>{
    modalArea.style.display = 'flex'
    countRuns = 0
})

closeSettings.addEventListener('click', () =>{
    modalArea.style.display = 'none'
})

let changes = new Array(inputs.length).fill(0)
let i = 0;

form.addEventListener('change', (e) =>{
    changes[e.target.id] = inputs[e.target.id].value
})

submit.addEventListener('click', () =>{
    modalArea.style.display = 'none'
    /*
    while( i < inputs.length / (themes.length - 1)){
        for(let j = i*2; j < i*2 + 1; j++)
        {
            if(changes[j]!=0)
            {
                console.log(changes[j])
                if(j % 2)
                    themes[i].time.seconds = changes[j]
                else themes[i].time.minutes = changes[j]
            }
        }
        if( i == 0)
        {
            setTimer(themes[0].time, themes[0].currentTime)
        }
        i++
    }
    */
   themes[0].time.minutes = inputs[0].value
   themes[0].time.seconds = inputs[1].value
   setTimer(themes[0])
   themes[1].time.minutes = inputs[2].value
   themes[1].time.seconds = inputs[3].value
   setTimer(themes[1])
   themes[2].time.minutes = inputs[4].value
   themes[2].time.seconds = inputs[5].value
   setTimer(themes[2])
})

let order = 0
let id = 0
let countTaskNumber = 0

addTask.addEventListener('click', () =>{
    taskBlock.style.maxHeight = 250 + 'px'
    addTask.style.display = 'none'
})

saveBtn.addEventListener('click', () =>{
    if(editFlag)
    {
        if(titleTask.value != '')
        {
            let newBlock = document.createElement('div')
            let vectorNTilte = document.createElement('div')
            let newSetting = document.createElement('button')
            let newSuccessBtn = document.createElement('button') 
            newSuccessBtn.setAttribute('id', id)
            newSetting.setAttribute('id', id)
            let titleTaskBlock = document.createElement('span')
            let newCount = document.createElement('span')
            let countNSetting = document.createElement('div')

            let dropdownTask = document.createElement('div')
            let dropdownTaskDeleteBtn = document.createElement('button')
            let dropdownTaskEditBtn = document.createElement('button')
            let dropdownTaskActiveBtn = document.createElement('button')

            dropdownTask.className = 'dropdown-task-settings'
            dropdownTaskDeleteBtn.className = 'dropdown-task-btn'
            dropdownTaskEditBtn.className = 'dropdown-task-btn'
            dropdownTaskActiveBtn.className = 'dropdown-task-btn'
            dropdownTask.setAttribute('id', id)
            dropdownTaskDeleteBtn.setAttribute('id', id)
            dropdownTaskEditBtn.setAttribute('id', id)
            dropdownTaskActiveBtn.setAttribute('id', id)
            dropdownTaskDeleteBtn.innerHTML = 'Delete this task'
            dropdownTaskEditBtn.innerHTML = 'Edit this task'
            dropdownTaskActiveBtn.innerHTML = 'To make active'

            newBlock.className = 'task'
            vectorNTilte.className = 'part-task-block-first'
            countNSetting.className = 'part-task-block-second'
            newSetting.className = 'settings-task-btn-black'
            newCount.className = 'count-number-task'
            titleTaskBlock.className = 'title-task-block'
            newSuccessBtn.className = 'vector-success'
            newBlock.style.order = order
            newCount.innerHTML = countTaskNumber + ' / ' + countInput.value
            titleTaskBlock.innerHTML = titleTask.value
            order++
            document.querySelector('.tasks').appendChild(newBlock)
            document.querySelectorAll('.task')[id].appendChild(vectorNTilte)
            document.querySelectorAll('.task')[id].appendChild(countNSetting)
            document.querySelectorAll('.task')[id].appendChild(dropdownTask)
            document.querySelectorAll('.part-task-block-first')[id].appendChild(newSuccessBtn)
            document.querySelectorAll('.part-task-block-first')[id].appendChild(titleTaskBlock)  
            document.querySelectorAll('.part-task-block-second')[id].appendChild(newCount)
            document.querySelectorAll('.part-task-block-second')[id].appendChild(newSetting)
            document.querySelectorAll('.dropdown-task-settings')[id].appendChild(dropdownTaskDeleteBtn)
            document.querySelectorAll('.dropdown-task-settings')[id].appendChild(dropdownTaskEditBtn)
            document.querySelectorAll('.dropdown-task-settings')[id].appendChild(dropdownTaskActiveBtn)
            let newTask = {
                id: id,
                title: titleTask.value,
                count: countInput.value,
                active: false,
                finished: false
            }
            if(tasks.length == 0)
            {
                newTask.active = true
                let activeTaskZero = document.querySelector('.task')
                activeTaskZero.classList.add('active-task')
            }
            tasks.push(newTask)
            id++
            countInput.value = '1'
            titleTask.value = ''
            newSuccessBtn.addEventListener('click', (e) => {
                let result;
                
                for(let i = 0; i < tasks.length; i++)
                {
                    if(tasks[i].id == e.target.id)
                        result = i
                }
                if(tasks[result].finished)
                {
                    tasks[result].finished = false
                    newSuccessBtn.style.opacity = '0.4'
                }
                else
                {
                    let taskList = document.querySelectorAll('.task')
                    tasks[result].finished = true
                    newSuccessBtn.style.opacity = '1'
                    if(tasks[result].active)
                    {
                        if((result+1) < tasks.length)
                        {
                            tasks[result+1].active = true
                            tasks[result].active = false
                            taskList[result+1].classList.add('active-task')
                            taskList[result].classList.remove('active-task')
                        }
                        taskList[result].classList.remove('active-task')
                    }
                }
            })

            let toogle = true
            newSetting.addEventListener('click', (e) => {
                let ddts = document.querySelectorAll('.dropdown-task-settings')
                for(let i = 0; i < ddts.length; i++)
                {
                    if(e.target.id == ddts[i].id)
                        if(toogle)
                        {
                            let j = 0
                            while(j < ddts.length)
                            {
                                ddts[j].style.display = 'none'
                                j++
                            }
                            ddts[i].style.display = 'flex' 
                        }
                        else 
                        {
                            ddts[i].style.display = 'none'
                        }
                }
                toogle = !toogle
            })

            dropdownTaskDeleteBtn.addEventListener('click', (e) => {
                let deletedTasks = document.querySelectorAll('.task')
                document.querySelector('.tasks').removeChild(deletedTasks[e.target.id]) 
                tasks.splice(e.target.id, 1)
                dropdownTask.style.display = 'none'
                toogle = !toogle
                id = 0
                let success = document.querySelectorAll('.vector-success')
                let newSet = document.querySelectorAll('.settings-task-btn-black')
                let dropList = document.querySelectorAll('.dropdown-task-settings')
                let dropListDelete = document.querySelectorAll('.dropdown-task-btn')
                let dropListEdit = document.querySelectorAll('.dropdown-task-btn')
                let dropListActive = document.querySelectorAll('.dropdown-task-btn')

                for(let i = 0; i < deletedTasks.length - 1; i++)
                {
                    success[i].id = id
                    newSet[i].id = id
                    dropList[i].id = id
                    dropListDelete[i].id = id
                    dropListEdit[i].id = id
                    dropListActive[i].id = id
                    id++
                }
            })

            dropdownTaskEditBtn.addEventListener('click', (e) => {
                editFlag = false
                editedBlockId = e.target.id
                taskBlock.style.maxHeight = 250 + 'px'
                addTask.style.display = 'none'
                let taskList = document.querySelectorAll('.task')
                taskList[e.target.id].style.display = 'none'
                titleTask.value = tasks[e.target.id].title
                countInput.value = tasks[e.target.id].count
            })

            dropdownTaskActiveBtn.addEventListener('click', (e) => {
                let taskList = document.querySelectorAll('.task')
                let i = 0
                while(i < tasks.length)
                {
                    if(tasks[i].active == true)
                    {
                        tasks[i].active = false
                        taskList[i].classList.remove('active-task')
                    }
                    i++
                }
                tasks[e.target.id].active = true
                taskList[e.target.id].classList.add('active-task')
            })
        }
    }
    else
    {
        let taskList = document.querySelectorAll('.task')
        let editedInput = document.querySelectorAll('.title-task-block')[editedBlockId]
        let editedCount = document.querySelectorAll('.count-number-task')[editedBlockId]
        editedCount.innerHTML = '0 / ' + countInput.value
        editedInput.innerHTML = titleTask.value
        tasks[editedBlockId].title = titleTask.value
        tasks[editedBlockId].count = countInput.value
        taskList[editedBlockId].style.display = 'flex'
        taskBlock.style.maxHeight = 0 + 'px'
        addTask.style.display = 'flex'
        countInput.value = '1'
        titleTask.value = ''
        editFlag = true
    }
})


closeBtn.addEventListener('click', () =>{
    let taskList = document.querySelectorAll('.task')
    taskBlock.style.maxHeight = 0 + 'px'
    addTask.style.display = 'flex'
    if(!editFlag)
    {
        taskList[editedBlockId].style.display = 'flex'
        editFlag = true
    }
})

let settingsTaskBtn = document.querySelector('.settings-task-btn')
let dropdownSettings = document.querySelector('.dropdown-settings')
let toogle = true
settingsTaskBtn.addEventListener('click', () => {
    if(toogle)
        dropdownSettings.style.display = 'flex'
    else dropdownSettings.style.display = 'none'
    toogle = !toogle
})

let clearAllBtn = document.getElementById("clearAll")
clearAllBtn.addEventListener('click', () => {
    let deletedTasks = document.querySelectorAll('.task')
    for(let i = 0; i < deletedTasks.length; i++)
        document.querySelector('.tasks').removeChild(deletedTasks[i])
    tasks.splice(0, tasks.length)
    dropdownSettings.style.display = 'none'
    toogle = !toogle
    id = 0
})

let clearFinishedBtn = document.getElementById("clearFinished")
clearFinishedBtn.addEventListener('click', () => {
    let deletedTasks = document.querySelectorAll('.task')
    let countDelete = 0
    for(let i = 0; i < deletedTasks.length; i++)
    {
        if(tasks[i].finished)
        {
            document.querySelector('.tasks').removeChild(deletedTasks[i])
            countDelete++
        }
    }
    let deletedIndexes = []
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].finished){
            deletedIndexes.push(i)
        }
    }
    
    for(let i = deletedIndexes.length - 1; i >= 0; i--)
    {
        tasks.splice(deletedIndexes[i],1)
    }

    id = 0
    let newSuccessBtn = document.querySelectorAll('.vector-success')
    let newSetting = document.querySelectorAll('.settings-task-btn-black')
    let dropdownTask = document.querySelectorAll('.dropdown-task-settings')
    let dropdownTaskDeleteBtn = document.querySelectorAll('.dropdown-task-btn')
    let dropdownTaskEditBtn = document.querySelectorAll('.dropdown-task-btn')
    let dropdownTaskActiveBtn = document.querySelectorAll('.dropdown-task-btn')

    for(let i = 0; i < deletedTasks.length - countDelete; i++)
    {
        newSuccessBtn[i].id = id
        newSetting[i].id = id
        dropdownTask[i].id = id
        dropdownTaskDeleteBtn[i].id = id
        dropdownTaskEditBtn[i].id = id
        dropdownTaskActiveBtn[i].id = id
        id++
    }
    dropdownSettings.style.display = 'none'
    toogle = !toogle
})


upBtn.addEventListener('click', () =>{
    countInput.value++
})

downBtn.addEventListener('click', () =>{
    if(countInput.value > 0)
        countInput.value--
})


wrapper.addEventListener('click', (e) =>{
    const isBtn = e.target.nodeName === 'BUTTON' 
    switch(e.target.id){
        case 'focus':{
            switchTheme(themes[0])
            previous.classList.toggle('active')
            e.target.classList.toggle('active')
            previous = e.target
            for(let i = 0; i < themes.length - 1; i++)
            {
                themes[i].active = false
            }
            themes[0].active = true
            setTimer(themes[0])
            if(switcher.classList.contains('started')){
                switcher.classList.toggle('started')
                stop()
                switcher.innerHTML = "START"
                skip.style.opacity = '0'
                skip.style.pointerEvents = 'none'
            }
            break;
        }
        case 'shortBreak':{
            switchTheme(themes[1])
            previous.classList.toggle('active')
            e.target.classList.toggle('active')
            previous = e.target
            for(let i = 0; i < themes.length - 1; i++)
            {
                themes[i].active = false
            }
            themes[1].active = true
            setTimer(themes[1])
            if(switcher.classList.contains('started')){
                switcher.classList.toggle('started')
                stop()
                switcher.innerHTML = "START"
                skip.style.opacity = '0'
                skip.style.pointerEvents = 'none'
            }
            break;
        }
        case 'longBreak':{
            switchTheme(themes[2])
            previous.classList.toggle('active')
            e.target.classList.toggle('active')
            previous = e.target
            for(let i = 0; i < themes.length - 1; i++)
            {
                themes[i].active = false
            }
            themes[2].active = true
            setTimer(themes[2])
            if(switcher.classList.contains('started')){
                switcher.classList.toggle('started')
                stop()
                switcher.innerHTML = "START"
                skip.style.opacity = '0'
                skip.style.pointerEvents = 'none'
            }
            break;
        }
        case 'switch':{
            e.target.classList.toggle('started')
            if(switcher.classList.contains("started"))
            {
                start(previous.id)
                switcher.innerHTML = "STOP"
                skip.style.opacity = '1'
                skip.style.pointerEvents = 'all'
            }
            else{
                stop()
                switcher.innerHTML = "START"
                skip.style.opacity = '0'
                skip.style.pointerEvents = 'none'
            }
            break;
        }
        case 'skip':{
            skipFunc()
        }
    }
})

let start = (id) =>{
    let currentIndex;
    switch(id){
        case 'focus': {
            currentIndex = 0
            break
        }
        case 'shortBreak': {
            
            currentIndex = 1
            break
        }
        case 'longBreak': {
            
            currentIndex = 2
            break
        }
    }
    interval = setInterval(function() { startTimer(currentIndex) },1000)
}

let stop = () =>{
    clearInterval(interval)
}

let tasksList;
let activeTask;

let skipFunc = () =>{
    if(tasks.length != 0)
    {
        tasksList = document.querySelectorAll('.task')
        for(let i = 0; i < tasksList.length; i++)
        {
            if(tasks[i].active)
                activeTask = i;
        }
    }
    countRuns += 0.5
    switcher.classList.toggle('started')
    stop()
    switcher.innerHTML = "START"
    skip.style.opacity = '0'
    skip.style.pointerEvents = 'none'
    switch(previous.id){
        case 'focus': {
            if(settingsStruct.autoSwitchBreak)
            {
                switcher.classList.toggle('started')
                if(countRuns == (Number(settingsStruct.longBreakInterval) + 0.5))
                {
                    switchTheme(themes[2])
                    previous.classList.toggle('active')
                    btn[2].classList.toggle('active')
                    previous = btn[2]
                    for(let i = 0; i < themes.length - 1; i++)
                    {
                        themes[i].active = false
                    }
                    themes[2].active = true
                    setTimer(themes[2])
                    start('longBreak')
                    switcher.innerHTML = "STOP"
                    skip.style.opacity = '1'
                    skip.style.pointerEvents = 'all'
                    countRuns = -0.5
                    countTaskNumber++
                    if(countTaskNumber < tasks[activeTask].count)
                    {
                        let countTask = document.querySelectorAll('.count-number-task')
                        countTask[activeTask].innerHTML = countTaskNumber + ' / ' + tasks[activeTask].count
                    }
                    else if(countTaskNumber == tasks[activeTask].count)
                    {
                        let countTask = document.querySelectorAll('.count-number-task')
                        countTask[activeTask].innerHTML = countTaskNumber + ' / ' + tasks[activeTask].count
                        countTaskNumber = 0
                        let successBtns = document.querySelectorAll('.vector-success')
                        tasks[activeTask].finished = true
                        successBtns[activeTask].style.opacity = '1'
                        if(settingsStruct.autoSwitchTask)
                        {
                        if(tasks[activeTask].active)
                        {
                            if((activeTask+1) < tasks.length)
                            {
                                tasks[activeTask+1].active = true
                                tasks[activeTask].active = false
                                tasksList[activeTask+1].classList.add('active-task')
                                tasksList[activeTask].classList.remove('active-task')
                            }
                            else{
                                switcher.classList.toggle('started')
                                stop()
                                switcher.innerHTML = "START"
                                skip.style.opacity = '0'
                                skip.style.pointerEvents = 'none'
                                switchTheme(themes[0])
                                previous.classList.toggle('active')
                                btn[0].classList.toggle('active')
                                previous = btn[0]
                                for(let i = 0; i < themes.length - 1; i++)
                                {
                                    themes[i].active = false
                                }
                                themes[0].active = true
                                setTimer(themes[0])
                            }
                            tasksList[activeTask].classList.remove('active-task')
                        }
                        }
                        else{
                            switcher.classList.toggle('started')
                                stop()
                                switcher.innerHTML = "START"
                                skip.style.opacity = '0'
                                skip.style.pointerEvents = 'none'
                                switchTheme(themes[0])
                                previous.classList.toggle('active')
                                btn[0].classList.toggle('active')
                                previous = btn[0]
                                for(let i = 0; i < themes.length - 1; i++)
                                {
                                    themes[i].active = false
                                }
                                themes[0].active = true
                                setTimer(themes[0])
                        }
                    }
                }
                else
                {
                    switchTheme(themes[1])
                    previous.classList.toggle('active')
                    btn[1].classList.toggle('active')
                    previous = btn[1]
                    for(let i = 0; i < themes.length - 1; i++)
                    {
                        themes[i].active = false
                    }
                    themes[1].active = true
                    setTimer(themes[1])
                    start('shortBreak')
                    switcher.innerHTML = "STOP"
                    skip.style.opacity = '1'
                    skip.style.pointerEvents = 'all'
                    countTaskNumber++
                    if(countTaskNumber < tasks[activeTask].count)
                    {
                        let countTask = document.querySelectorAll('.count-number-task')
                        countTask[activeTask].innerHTML = countTaskNumber + ' / ' + tasks[activeTask].count
                    }
                    else if(countTaskNumber == tasks[activeTask].count)
                    {
                        let countTask = document.querySelectorAll('.count-number-task')
                        countTask[activeTask].innerHTML = countTaskNumber + ' / ' + tasks[activeTask].count
                        countTaskNumber = 0
                        let successBtns = document.querySelectorAll('.vector-success')
                        tasks[activeTask].finished = true
                        successBtns[activeTask].style.opacity = '1'
                        if(settingsStruct.autoSwitchTask)
                        {
                        if(tasks[activeTask].active)
                        {
                            if((activeTask+1) < tasks.length)
                            {
                                tasks[activeTask+1].active = true
                                tasks[activeTask].active = false
                                tasksList[activeTask+1].classList.add('active-task')
                                tasksList[activeTask].classList.remove('active-task')
                            }
                            else{
                                switcher.classList.toggle('started')
                                stop()
                                switcher.innerHTML = "START"
                                skip.style.opacity = '0'
                                skip.style.pointerEvents = 'none'
                                switchTheme(themes[0])
                                previous.classList.toggle('active')
                                btn[0].classList.toggle('active')
                                previous = btn[0]
                                for(let i = 0; i < themes.length - 1; i++)
                                {
                                    themes[i].active = false
                                }
                                themes[0].active = true
                                setTimer(themes[0])
                            }
                            tasksList[activeTask].classList.remove('active-task')
                        }
                        }
                        else{
                            switcher.classList.toggle('started')
                                stop()
                                switcher.innerHTML = "START"
                                skip.style.opacity = '0'
                                skip.style.pointerEvents = 'none'
                                switchTheme(themes[0])
                                previous.classList.toggle('active')
                                btn[0].classList.toggle('active')
                                previous = btn[0]
                                for(let i = 0; i < themes.length - 1; i++)
                                {
                                    themes[i].active = false
                                }
                                themes[0].active = true
                                setTimer(themes[0])
                        }
                    }
                }
            }
            else
            {
                switchTheme(themes[1])
                previous.classList.toggle('active')
                btn[1].classList.toggle('active')
                previous = btn[1]
                for(let i = 0; i < themes.length - 1; i++)
                    {
                        themes[i].active = false
                    }
                    themes[1].active = true
                    setTimer(themes[1])
            }
            break
        }
        case 'shortBreak': {
            switchTheme(themes[0])
            previous.classList.toggle('active')
            btn[0].classList.toggle('active')
            previous = btn[0]
            for(let i = 0; i < themes.length - 1; i++)
            {
                themes[i].active = false
            }
            themes[0].active = true
            setTimer(themes[0])
            if(settingsStruct.autoSwitchFocus)
            {
                switcher.classList.toggle('started')
                start(previous.id)
                switcher.innerHTML = "STOP"
                skip.style.opacity = '1'
                skip.style.pointerEvents = 'all'
            }
            break
        }
        case 'longBreak': {
            switchTheme(themes[0])
            previous.classList.toggle('active')
            btn[0].classList.toggle('active')
            previous = btn[0]
            for(let i = 0; i < themes.length - 1; i++)
            {
                themes[i].active = false
            }
            themes[0].active = true
            setTimer(themes[0])
            if(settingsStruct.autoSwitchFocus)
            {
                switcher.classList.toggle('started')
                start(previous.id)
                switcher.innerHTML = "STOP"
                skip.style.opacity = '1'
                skip.style.pointerEvents = 'all'
            }
            break
        }
    }
}




