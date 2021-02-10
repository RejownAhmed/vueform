import { createForm, findAllComponents, testPropDefault } from 'test-helpers'
import { nextTick } from 'composition-api'

export const accept = function (elementType, elementName, options) {
  testPropDefault(it, elementType, 'accept', null, ['.jpg', '.png'])
}

export const handleChange = function (elementType, elementName, options) { 
  it('should add files on `handleChange` when it is a single element', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          auto: false,
        }
      }
    })

    let el = form.vm.el$('el')

    let file = new File([''], 'filename.jpg')
    let file2 = new File([''], 'filename2.jpg')

    el.handleChange({
      target: {
        files: [file, file2]
      }
    })

    await nextTick()

    expect(el.value).toStrictEqual([file, file2])
  })

  it('should add files on `handleChange` when it is an object element', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          auto: false,
          object: true,
        }
      }
    })

    let el = form.vm.el$('el')

    let file = new File([''], 'filename.jpg')
    let file2 = new File([''], 'filename2.jpg')

    el.handleChange({
      target: {
        files: [file, file2]
      }
    })

    await nextTick()

    expect(el.value).toStrictEqual([
      { file: file },
      { file: file2 }
    ])
  })

  it('should not add files on `handleChange` when disabled', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          auto: false,
          disabled: true,
        }
      }
    })

    let el = form.vm.el$('el')

    let file = new File([''], 'filename.jpg')
    let file2 = new File([''], 'filename2.jpg')

    el.handleChange({
      target: {
        files: [file, file2]
      }
    })

    await nextTick()

    expect(el.value).toStrictEqual(el.nullValue)
  })
}

export const handleClick = function (elementType, elementName, options) {
  it('should click input element when upload button is clicked in `handleClick`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          auto: false,
        }
      }
    })

    let el = form.vm.el$('el')
    let elWrapper = findAllComponents(form, { name: elementName }).at(0)

    let clickMock = jest.fn()

    el.input = {
      click: clickMock
    }

    expect(clickMock).not.toHaveBeenCalled()

    elWrapper.find(`[class="${el.classes.selectButton}"]`).trigger('click')

    await nextTick()

    expect(clickMock).toHaveBeenCalled()
  })

  it('should not click input element when upload button is clicked & disabled in `handleClick`', async () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
          auto: false,
          disabled: true
        }
      }
    })

    let el = form.vm.el$('el')

    let clickMock = jest.fn()

    el.input = {
      click: clickMock
    }

    expect(clickMock).not.toHaveBeenCalled()

    el.handleClick()

    await nextTick()

    expect(clickMock).not.toHaveBeenCalled()
  })
}