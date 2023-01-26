const slider = (function(){
	
	
	const slider = document.getElementById("slider"); 
	console.log(slider);
	const sliderContent = document.querySelector(".slider-content");
	console.log(sliderContent);
	const sliderWrapper = document.querySelector(".slider-content-wrapper"); 
	const elements = document.querySelectorAll(".slider-content__item");
	const sliderContentControls = createHTMLElement("div", "slider-content__controls");
	let dotsWrapper = null; 
	let prevButton = null; 
	let nextButton = null;
	let leftArrow = null; 
	let rightArrow = null;
	let intervalId = null; 
	
	// data
	const itemsInfo = {
		offset: 0, // offset of the container with slides relative to the starting point (first slide)
		position: {
			current: 0, 
			min: 0, 
			max: elements.length - 1 
		},
		intervalSpeed: 2000, 

		update: function(value) {
			this.position.current = value;
			this.offset = -value;
		},
		reset: function() {
			this.position.current = 0;
			this.offset = 0;
		}	
	};

	const controlsInfo = {
		buttonsEnabled: false,
		dotsEnabled: false,
		prevButtonDisabled: true,
		nextButtonDisabled: false
	};

	// Slider initialization
	function init(props) {
		let {intervalSpeed, position, offset} = itemsInfo;
		if (slider && sliderContent && sliderWrapper && elements) {
			if (props && props.intervalSpeed) {
				intervalSpeed = props.intervalSpeed;
			}
			if (props && props.currentItem) {
				if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
					position.current = props.currentItem;
					offset = - props.currentItem;	
				}
			}
			if (props && props.buttons) {
				controlsInfo.buttonsEnabled = true;
			}
			if (props && props.dots) {
				controlsInfo.dotsEnabled = true;
			}
			_updateControlsInfo();
			_createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
			_render();	
		} else {
			console.log("The slider layout is incorrect. Check if all required classes are present 'slider/slider-content/slider-wrapper/slider-content__item'");
		}
	}
	function _updateControlsInfo() {
		const {current, min, max} = itemsInfo.position;
		controlsInfo.prevButtonDisabled = current > min ? false : true;
		controlsInfo.nextButtonDisabled = current < max ? false : true;
	}
	function _createControls(dots = false, buttons = false) {
		sliderContent.append(sliderContentControls);
		buttons ? createButtons() : null;
		dots ? createDots() : null;
		
		function createDots() {
			dotsWrapper = createHTMLElement("div", "dots");			
			for(let i = 0; i < itemsInfo.position.max + 1; i++) {
				const dot = document.createElement("div");
				dot.className = "dot";
				dot.addEventListener("click", function() {
					updateItemsInfo(i);
				})
				dotsWrapper.append(dot);		
			}
			sliderContentControls.append(dotsWrapper);	
		}
		function createButtons() {
				intervalId = setInterval(function(){
					if (itemsInfo.position.current < itemsInfo.position.max) {
						itemsInfo.update(itemsInfo.position.current + 1);
					} else {
						itemsInfo.reset();
					}
					_slideItem();
				}, itemsInfo.intervalSpeed)
		}
	}

	// Set class for controls (buttons, arrows)
	function setClass(options) {
		if (options) {
			options.forEach(({element, className, disabled}) => {
				if (element) {
					disabled ? element.classList.add(className) : element.classList.remove(className)	
				} else {
					console.log("Error: function setClass(): element = ", element);
				}
			})
		}
	}

	// Update Slider Values
	function updateItemsInfo(value) {
		itemsInfo.update(value);
		_slideItem(true);	
	}

	// Show Items
	function _render() {
		const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
		let controlsArray = [
			{element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
			{element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
		];
		if (controlsInfo.buttonsEnabled) {
			controlsArray = [
				...controlsArray, 
				{element:prevButton, className: "disabled", disabled: prevButtonDisabled},
				{element:nextButton, className: "disabled", disabled: nextButtonDisabled}
			];
		}
		
		// Отображаем/скрываем контроллы
		setClass(controlsArray);

		// Передвигаем слайдер
		sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
		
		// Задаем активный элемент для точек (dot)
		if (controlsInfo.dotsEnabled) {
			if (document.querySelector(".dot--active")) {
				document.querySelector(".dot--active").classList.remove("dot--active");	
			}
			dotsWrapper.children[itemsInfo.position.current].classList.add("dot--active");
		}
	}

	// Move slide
	function _slideItem(autoMode = false) {
		if (autoMode && intervalId) {
			clearInterval(intervalId);
		}
		_updateControlsInfo();
		_render();
	}

	// Create HTML markup for an element
	function createHTMLElement(tagName="div", className, innerHTML) {
		const element = document.createElement(tagName);
		className ? element.className = className : null;
		innerHTML ? element.innerHTML = innerHTML : null;
		return element;
	}

	// Доступные методы
	return {init};
}())

slider.init({
	intervalSpeed: 3000,
	currentItem: 0,
	buttons: true,
	dots: true
});