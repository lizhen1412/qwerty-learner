import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import IconKeyboard from '~icons/ic/round-keyboard'
import IconX from '~icons/tabler/x'

/**
 * 打字指法图示
 * @returns 打字指法图示
 */
export default function HandPositionIllustration() {
  /**
   * 是否打开
   */
  const [isOpen, setIsOpen] = useState(false)

  /**
   * 关闭对话框
   */
  function closeModal() {
    // 设置是否打开为 false
    setIsOpen(false)
  }

  /**
   * 打开对话框
   */
  function openModal() {
    // 设置是否打开为 true
    setIsOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white  ${
          isOpen && 'bg-indigo-500 text-white'
        }`}
      >
        <IconKeyboard className="icon"></IconKeyboard>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-200  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                  <button type="button" onClick={() => setIsOpen(false)} title="关闭对话框">
                    <IconX className="absolute right-7 top-5 cursor-pointer text-gray-400" />
                  </button>
                  <Dialog.Title as="h3" className="text-center text-xl font-medium leading-6 text-gray-800 dark:text-gray-200">
                    推荐打字指法图示
                  </Dialog.Title>
                  <div className="mt-8">
                    <img className="block " src={standTypingHandPosition} alt="" />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
