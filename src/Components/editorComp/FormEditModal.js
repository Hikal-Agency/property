import React,{useState,useEffect} from "react"
import { Button } from "@material-tailwind/react"
import Select from "react-select"
import {
    pageStyles,
    renderStyles,
    renderStyles2,
  } from "../_elements/SelectStyles";
  import { IoImageOutline } from "react-icons/io5";
  import { CiCirclePlus } from "react-icons/ci";
  import { RiFontSize2 } from "react-icons/ri";
  import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  TextField,
  FormControl,
  IconButton,
  InputLabel,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose,MdDeleteOutline } from "react-icons/md";
import { HiOutlineDuplicate } from "react-icons/hi";
const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

const fieldsTypeOptions = [
  {label:"Short Answer",value:"Short Answer"},
  {label:"Paragraph",value:"Paragraph"},
  {label:"Multiple Choice",value:"Multiple Choice"},
  {label:"Checkboxes",value:"Checkboxes"},
  {label:"Dropdown",value:"Dropdown"},
  {label:"Date",value:"Date"},
  {label:"Time",value:"Time"},
]
const FormEditModal = ({formEditModal,setFormEditModal}) =>{
    const [isClosing, setIsClosing] = useState(false);
    const [fields,setFields] = useState([
      {
        label:'Untitled Question',
        fieldType:"text",
        options:[
          "option 1"
        ],
        isRequired:false,
        isActive:false,
      }
    ])
    const {
        darkModeColors,
        currentMode,
        User,
        t,
        isLangRTL,
        i18n,
        primaryColor,
      } = useStateContext();


      const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
          setIsClosing(false);
          setFormEditModal(false);
        }, 1000);
      };

      const fieldTypeChangeHandler = (value,index) =>{
        setFields(pre=>{
          const preR = pre;
          preR[index].fieldType = value;
          return [...preR]
        })
      }
    return (
        <Modal
        keepMounted
        open={formEditModal}
        onClose={()=>setFormEditModal(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
      
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` bg-[#F0EBF8] ${
              currentMode === "dark"
                ? " text-white"
                : " text-black"
            } ${
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll bg-[#F0EBF8]
            `}
          >
           <div>
            <div className="w-[70%] border m-auto text-black flex flex-col gap-5">
                <div className="form-header p-4 bg-white rounded">
                    <div className="w-full">
                    <input type="text" name="" placeholder="Form Title" className="form_title text-[28px] p-2 w-full font-medium focus:outline-none border-b" id="" />
                    </div>
               <div className="w-full">
                  <input type="text" placeholder="Form Description" className="form_description p-2 w-full focus:outline-none border-b text-[14px] "/>
               </div>
                  
                </div>
                {fields?.map((field,index)=>{
                  return <div className="flex"><div className="bg-white rounded px-6 pt-6 w-[90%]">
                  <div className="flex gap-4 items-center">
                    <input type="text" name="" id="" value={field?.label} className="w-[70%] border-b p-2 focus:outline-none bg-gray-100 text-[16px]"/>
                    <div className="w-[5%]">
                      <IoImageOutline size={24}/>
                    </div>
                    <div className="w-[25%]">
                     <Select
                     options={fieldsTypeOptions}
                     placeholder={`---${t("label_select")?.toUpperCase()}---`}
                     className="w-full"
                     menuPortalTarget={document.body}
                     styles={renderStyles(currentMode, primaryColor)}
                     onChange={(e)=>{
                       fieldTypeChangeHandler(e.value,index)
                     }}
                     />
                    </div>
                  </div>
                  <div className="text-[16px]">
                    {field?.fieldType != "text" && <>{field?.options?.map((option,index)=>{
                      return <div className="flex flex-col gap-3 my-3 text-[16px]">
                      <div className="flex items-center gap-2"> <input type={field?.fieldType} name="" id="" /><label htmlFor="">{option}</label></div>
                     </div>
                    })}
                    <button >
                      Add option
                    </button>
                    </>
                    }
                    {
                      field?.fieldType =="text" &&
                       <div className="mb-9">
                          <input type="text" name="" id="" className="w-full p-3 focus:outline-none border-b"/>
                        </div>
                    }
                    
                  </div>
                  
                  <div className="flex justify-end items-center border-t mt-5 p-3">
                    <div className="flex items-center gap-3">
                    <HiOutlineDuplicate size={24}/>
                    <MdDeleteOutline size={24}/>
                    </div>
                   
                   <FormControlLabel control={<Switch />} label="Required" labelPlacement="start" />
                  </div>
                </div>
                <div className="p-4 w-[10%]">
                  <CiCirclePlus size={24}/>
                  <RiFontSize2 size={24}/>
                </div>
                </div>
                })}
                

            </div>
          </div>
          </div>
         
        </div>
      </Modal>
    )
}

export default FormEditModal;