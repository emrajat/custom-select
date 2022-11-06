const customSelect = new(function() {
    const _this = this;
    const selectEl = document.querySelectorAll("select.custom-select");

    _this.init = () => {
        _this.customizeSelectMenu();
    }

    _this.createCustomizeDropDownEl = (customizeSelectButton, options) => {
        const dropDownWrapper = document.createElement('div');
        const ulEl = document.createElement("ul");
        const iconSpan = document.createElement('span');
        _this.addClassOnElement(iconSpan, "ui-selectmenu-icon");

        _this.addClassOnElement(dropDownWrapper, "custom-ui-select-dropdown")
        options.forEach(({
            value,
            text
        }) => {
            const liEl = document.createElement("li");
            liEl.innerText = `${text}`;
            liEl.setAttribute("value", `${value}`);
            ulEl.append(liEl);
            ulEl.firstChild.classList.add('active');
        });
        customizeSelectButton.insertAdjacentElement('afterend', iconSpan);
        dropDownWrapper.appendChild(ulEl)
        document.body.appendChild(dropDownWrapper);
    }

    _this.getSelectOptionValues = (currentSelectEl) => {
        let optionText = [];
        let optionTextData = {};
        for (let option of currentSelectEl.options) {
            optionTextData = {
                text: option.text,
                value: option.value
            };
            optionText.push(optionTextData);
        }
        return optionText;
    }

    _this.addClassOnElement = (element, className) => {
        element.classList.add(className);
    }


    _this.outsideSelectClickHandler = (event) => {
        const {
            target
        } = event;
        const customSelectBtn = document.querySelectorAll('.custom-ui-select')
        const root = target ? target.closest('.custom-ui-select') : e;
        const dropDownExist = document.querySelectorAll('.custom-ui-select-dropdown-open');

        if (!root) {
            dropDownExist.forEach((node) => {
                node.classList.remove('custom-ui-select-dropdown-open');
            });

            customSelectBtn.forEach((node) => {
                node.classList.remove('custom-ui-select-menu-open');
            })

        }
    }


    _this.selectBtnClickHandler = (event, index, customizeSelectButton) => {
        const dropDownEl = document.querySelectorAll('div.custom-ui-select-dropdown');
        const dropDownExist = document.querySelectorAll('.custom-ui-select-dropdown-open');
        const hasClass = dropDownEl[index].classList.contains('custom-ui-select-dropdown-open');
        const selectElWidth = customizeSelectButton.clientWidth;
        const selectElHeight = customizeSelectButton.clientHeight;
        const boundingRect = customizeSelectButton.getBoundingClientRect();
        const {
            x: horizontalPosition,
            y: verticalPosition
        } = boundingRect;
        dropDownEl[index].style.width = `${selectElWidth}px`;
        if (window.innerHeight - boundingRect.bottom < 310) {
            dropDownEl[index].style.top = `${ verticalPosition + window.scrollY - 225}px`;
            dropDownEl[index].style.left = `${horizontalPosition}px`;
        } else {
            dropDownEl[index].style.left = `${horizontalPosition}px`;
            dropDownEl[index].style.top = `${verticalPosition + window.scrollY + selectElHeight}px`;
        }

        dropDownEl[index].style.position = `absolute`;

        dropDownExist.forEach((node) => {
            node.classList.remove('custom-ui-select-dropdown-open');
        })
        event.target.classList.toggle('custom-ui-select-menu-open')
        if (!hasClass) {
            dropDownEl[index].classList.toggle('custom-ui-select-dropdown-open');
        }

    }

    _this.selectBtnKeyUpDownHandler = (event, index, currentSelectEl) => {
        const selectBtn = document.querySelectorAll('div.custom-ui-select-dropdown');
        const dropDownWrapper = selectBtn[index];
        const ulEl = dropDownWrapper.querySelector('ul')
        const keycode = (event.keyCode ? event.keyCode : event.which);
        const hasClass = dropDownWrapper.classList.contains('custom-ui-select-dropdown-open')
        const activeElement = dropDownWrapper.querySelector('.active');
        const ulScrollHeight = ulEl.scrollHeight;
        const ulVisibleHeight = ulEl.offsetHeight;
        const liElHeight = activeElement.offsetHeight;
        const activeElPosition = activeElement.offsetTop;


        // Close DropDown menu on Enter Key
        if (hasClass && keycode == '13') {
            event.target.innerText = activeElement.innerText;
            currentSelectEl.value = activeElement.getAttribute("value");
        }

        //Close drop-down Menu on Tab key
        if (keycode == '9') {
            if (hasClass) {
                dropDownWrapper.classList.remove('custom-ui-select-dropdown-open');
            }
        }

        //Close drop-down Menu on Esc key
        if (keycode == '27') {
            if (hasClass) {
                dropDownWrapper.classList.remove('custom-ui-select-dropdown-open');
            }
        }

        // Check key press is down-arrow
        if (keycode == '40') {
            event.preventDefault();
            const nextEl = activeElement.nextElementSibling;
            if (nextEl) {
                ulEl.focus();
                activeElement.classList.remove('active');
                nextEl.classList.add('active');
                if (!hasClass) {
                    event.target.innerText = activeElement.nextElementSibling.innerText;
                    currentSelectEl.value = activeElement.nextElementSibling.getAttribute("value");
                }
            }
        }

        // Check key press is up-arrow
        if (keycode == '38') {
            event.preventDefault();
            const previousEl = activeElement.previousElementSibling;
            if (previousEl) {
                activeElement.classList.remove('active');
                previousEl.classList.add('active');
                if (!hasClass) {
                    event.target.innerText = activeElement.previousElementSibling.innerText;
                    currentSelectEl.value = activeElement.previousElementSibling.getAttribute("value");
                }
            }
        }

        if (activeElPosition > (ulVisibleHeight - (2 * liElHeight)) && keycode == '40') {
            ulEl.scrollTop += activeElement.offsetHeight;
        } else if (activeElPosition < (ulScrollHeight - ulVisibleHeight + liElHeight) && keycode == '38') {
            ulEl.scrollTop -= activeElement.offsetHeight;
        }
    }


    _this.dropDownElementClick = (event, customizeSelectButton, currentSelectEl) => {
        const {
            target
        } = event;
        let selectElement = currentSelectEl;
        let btnElement = customizeSelectButton;
        btnElement.innerText = target.innerText;
        target.closest('div.custom-ui-select-dropdown').classList.toggle('custom-ui-select-dropdown-open');
        selectElement.value = target.getAttribute("value");
        let liElementsList = target.closest('ul').querySelectorAll('li');

        liElementsList.forEach((currentItem) => {
            currentItem.classList.remove('active');
        })
        _this.addClassOnElement(target, 'active');
    }


    _this.customizeSelectMenu = () => {

        selectEl.length !== 0 && selectEl.forEach((currentSelectEl, index) => {
            currentSelectEl.style.display = "none";
            let customizeSelectButton = document.createElement('button');
            _this.addClassOnElement(customizeSelectButton, "custom-ui-select")
            let options = _this.getSelectOptionValues(currentSelectEl);
            let customizeSelectButtonInnerText = options?.length > 0 ? options[0].text : `No Option to display`;
            customizeSelectButton.innerText = customizeSelectButtonInnerText;
            currentSelectEl.insertAdjacentElement('afterend', customizeSelectButton);
            _this.createCustomizeDropDownEl(customizeSelectButton, options);

            if (options?.length !== 0) {
                const selectBtn = document.querySelectorAll('ul');
                let ulEl = selectBtn[index];

                customizeSelectButton.addEventListener("click", (event) => _this.selectBtnClickHandler(event, index, customizeSelectButton));
                customizeSelectButton.addEventListener("keydown", (event) => _this.selectBtnKeyUpDownHandler(event, index, currentSelectEl));

                ulEl.addEventListener("click", (event) => _this.dropDownElementClick(event, customizeSelectButton, currentSelectEl));
            }
        });

        selectEl.length !== 0 && document.addEventListener("click", (event) => {
            _this.outsideSelectClickHandler(event);
        });
    };


});

customSelect.init();