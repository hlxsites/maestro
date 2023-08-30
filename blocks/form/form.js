function createSelect(fd) {
  const select = document.createElement('select');
  select.id = fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  fd.Options.split(',').forEach((o) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  if (fd.Mandatory === 'x') {
    select.setAttribute('required', 'required');
  }
  return select;
}

async function createFormLoader(formContainer) {
  const loader = document.createElement('div');
  loader.className = 'form-loader';

  const loaderInner = document.createElement('div');
  loaderInner.className = 'form-loader-inner';
  loader.appendChild(loaderInner);

  // Create Lottie player element for animation
  const lottiePlayer = document.createElement('lottie-player');
  lottiePlayer.setAttribute('src', '/styles/icons/form-loader.json'); // Path to your Lottie JSON file
  lottiePlayer.setAttribute('background', 'transparent');
  lottiePlayer.setAttribute('speed', '1');
  lottiePlayer.setAttribute('style', 'width: 150px; height: 150px'); // Set to same dimensions as your form-loader-icon
  lottiePlayer.setAttribute('loop', '');
  lottiePlayer.setAttribute('autoplay', '');

  loaderInner.appendChild(lottiePlayer);

  const loaderLabel = document.createElement('h4');
  loaderLabel.className = 'form-loader-label';
  loaderLabel.textContent = 'Processing';
  loaderInner.appendChild(loaderLabel);

  formContainer.appendChild(loader);
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

async function submitForm(form) {
  const formContainer = form.closest('.form');

  // Display loader
  await createFormLoader(formContainer);

  const payload = constructPayload(form);

  payload.timestamp = new Date().toJSON();
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();

  // Remove the loader after processing is done (place it appropriately)
  const loader = formContainer.querySelector('.form-loader');
  if (loader) loader.remove();

  return payload;
}

function createButton(fd) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  button.classList.add('button');
  if (fd.Type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (fd.Placeholder) form.dataset.action = fd.Placeholder;
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', '');
        await submitForm(form);
        const redirectTo = fd.Extra;
        window.location.href = redirectTo;
      }
    });
  }
  return button;
}

function createHeading(fd, el) {
  const heading = document.createElement(el);
  heading.textContent = fd.Label;
  return heading;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createTextArea(fd) {
  const input = document.createElement('textarea');
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  label.textContent = fd.Label;
  if (fd.Mandatory === 'x') {
    label.classList.add('required');
  }
  return label;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

function fill(form) {
  const { action } = form.dataset;
  if (action === '/tools/bot/register-form') {
    const loc = new URL(window.location.href);
    form.querySelector('#owner').value = loc.searchParams.get('owner') || '';
    form.querySelector('#installationId').value = loc.searchParams.get('id') || '';
  }
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  json.data.forEach((fd) => {
    fd.Type = fd.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    const fieldId = `form-${fd.Type}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    fieldWrapper.classList.add('field-wrapper');
    switch (fd.Type) {
      case 'select':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case 'heading':
        fieldWrapper.append(createHeading(fd, 'h3'));
        break;
      case 'legal':
        fieldWrapper.append(createHeading(fd, 'p'));
        break;
      case 'checkbox':
        fieldWrapper.append(createInput(fd));
        fieldWrapper.append(createLabel(fd));
        break;
      case 'text-area':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextArea(fd));
        break;
      case 'submit':
        fieldWrapper.append(createButton(fd));
        break;
      case 'disclaimer':
        fieldWrapper.append(createHeading(fd, 'p'));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }

    const inputElement = fieldWrapper.querySelector('input, select, textarea, button');
    if (inputElement) {
      inputElement.addEventListener('focus', (event) => {
        event.target.classList.add('focus-shadow');
        event.target.classList.remove('error-shadow');
      });

      inputElement.addEventListener('blur', (event) => {
        event.target.classList.remove('focus-shadow');
        if (!event.target.checkValidity()) {
          event.target.classList.add('error-shadow');
        }
      });

      // For buttons, we want a style when it's pressed but not clicked.
      if (inputElement.tagName === 'BUTTON') {
        let buttonPressed = false;

        inputElement.addEventListener('mousedown', () => {
          inputElement.classList.add('focus-shadow');
          buttonPressed = true;
        });

        document.addEventListener('mouseup', () => {
          if (buttonPressed) {
            inputElement.classList.remove('focus-shadow');
            buttonPressed = false;
          }
        });
      }
    }

    form.append(fieldWrapper);
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);
  fill(form);
  return (form);
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
}
