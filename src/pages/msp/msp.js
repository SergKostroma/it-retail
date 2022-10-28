import {createPopper} from '@popperjs/core'
import $ from 'jquery'
import JustValidate from 'just-validate'
import lozad from 'lozad'
import axios from "axios";

// Lazy load
const initLozad = function () {
  const observer = lozad();
  observer.observe();
};
initLozad();

// Poppers
function show(tooltip, popperInstance) {
  // Make the tooltip visible
  tooltip.setAttribute('data-show', '');

  // Enable the event listeners
  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      {name: 'eventListeners', enabled: true},
    ],
  }));

  // Update its position
  popperInstance.update();
}

function hide(tooltip, popperInstance) {
  // Hide the tooltip
  tooltip.removeAttribute('data-show');

  // Disable the event listeners
  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      {name: 'eventListeners', enabled: false},
    ],
  }));
}

const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];

const moduleButtons = $('.module-block__button')

if (moduleButtons.length) {
  moduleButtons.each(function (idx, button) {
    const $tooltip = $(this).find('.module-block__button-tooltip')

    if ($tooltip.length) {
      const popperInstance = createPopper(button, $tooltip[0], {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 17],
            },
          },
        ],
      });

      showEvents.forEach((event) => {
        button.addEventListener(event, () => {
          show($tooltip[0], popperInstance)
        });
      });

      hideEvents.forEach((event) => {
        button.addEventListener(event, () => {
          hide($tooltip[0], popperInstance)
        });
      });
    }
  })
}

function getHeaderHeight() {
  const header = document.querySelector('.header')
  return header.getBoundingClientRect().height
}

let menuOpened = false

// header fixed
const logicFixed = () => {
  const header = document.querySelector('.header');
  const headerHeight = getHeaderHeight()
  const headerMobile = $('.header__mobile')

  if (window.pageYOffset > header.offsetTop) {
    header.classList.add('is-fixed-discount');
  } else {
    header.classList.remove('is-fixed-discount');

    if (!menuOpened) {
      header.classList.remove('header--opened')
    }

    if (menuOpened && !header.classList.contains('header--opened')) {
      header.classList.add('header--opened')
    }
  }

  headerMobile.css('top', headerHeight + 'px')
};

window.addEventListener('scroll', logicFixed);

// mobile menu
$('.header__burger').on('click', function () {
  $('body').toggleClass('no-scroll')
  menuOpened = !menuOpened
  const header = document.querySelector('.header')
  const headerHeight = getHeaderHeight()

  const headerMobile = $('.header__mobile')
  if (!header.classList.contains('is-fixed')) {
    header.classList.add('header--opened')
  }
  headerMobile.css('top', headerHeight + 'px')
  headerMobile.slideToggle(350, () => {
    if (!header.classList.contains('is-fixed') && !menuOpened) {
      header.classList.remove('header--opened')
    }
  })
  $(this).toggleClass('header__burger--open')
  $('.shadow').toggleClass('shadow--shown')
})

// form validation
const validation = new JustValidate('#integration-form')

let closeTimer = null

const closeMessage = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
  }

  validation.form.reset()
  const labels = validation.form.querySelectorAll('.input-field__label')
  labels.forEach(label => label.removeAttribute('style'))
}

const successBlockButton = document.querySelector('.integration__success-block-button')
successBlockButton.addEventListener('click', () => {
  const successBlock = document.querySelector('.integration__success-block')
  const formBlock = document.querySelector('.integration__form-block')
  successBlock.classList.remove('integration__success-block--shown')
  formBlock.classList.remove('integration__form-block--hidden')
  closeMessage()
})

validation
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Обязательное поле'
    },
    {
      rule: 'minLength',
      value: 3,
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Максимальная длина 30 символов'
    },
  ])
  .addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'Обязательное поле'
    },
    {
      rule: 'minLength',
      value: 18,
      errorMessage: 'Номер телефона не соответствует максимальной длине'
    }
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'Обязательное поле',
    },
    {
      rule: 'email',
      errorMessage: 'Неправильно указан email',
    },
  ])
  .onSuccess((e) => {
    const data = {};
    const fields = e.target?.querySelectorAll('input');

    fields.forEach(item => {
      if (item.name) {
        data[item.name] = item?.value
      }
    });

    axios.post('/api/', data).then(({data}) => {
      if (!data?.success) {
        throw new Error('Не удалось отрпавить');
      }

      const formBlock = document.querySelector('.integration__form-block');
      const successBlock = document.querySelector('.integration__success-block');
      formBlock.classList.add('integration__form-block--hidden');
      successBlock.classList.add('integration__success-block--shown');
      closeTimer = setTimeout(() => {
        formBlock.classList.remove('integration__form-block--hidden');
        successBlock.classList.remove('integration__success-block--shown');
        e.srcElement.reset();
        const labels = e.srcElement.querySelectorAll('.input-field__label');
        labels.forEach(label => label.removeAttribute('style'))
      }, 5000);
    }).catch(err => {
      alert("К сожалению произошла ошибка, попробуйте позже.");
      console.log({err});
    });


  });

// Scroll to section
$("a.scroll-to").on("click", function (e) {
  e.preventDefault();
  const anchor = $(this).attr('href');
  $('html, body').stop().animate({
    scrollTop: $(anchor).offset().top - 60
  }, 600);
  return false;
});
