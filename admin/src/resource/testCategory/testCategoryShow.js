import {
    BulkDeleteButton,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    EditButton,
    Filter,
    FunctionField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    ResourceContextProvider,
    SearchInput,
    SelectInput,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TextInput,
    useResourceContext, useTranslate,useGetList,ListContextProvider,useList,useGetOne
} from 'react-admin';
import { Card, CardContent, CardHeader } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Block } from 'notiflix/build/notiflix-block-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import React, {Fragment,useState,useEffect} from 'react';
import {useParams} from 'react-router';
import {CategoryRounded as Icon, LibraryAdd} from '@mui/icons-material';
import {CustomResetViewsButton, List, SimpleForm} from '@/components';
import useStyles from '@/styles';
import {ChangesForm} from './changesForm';
import {Val} from '@/Utils';
import API, {BASE_URL} from '@/functions/API';
import {Chip} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';




export const testCategoryShow = (props) => {
    const translate = useTranslate();
    const { id } = useParams();
    const [testCategory,setCategory] = useState({});
    const [tests,settests] = useState([]);
    const [selecttests,setSelectedtests] = useState([]);
    let testObj = [];
    let loop =true;
  
    const getCategoryById = (values) =>{
        if(values){
            values.map((test)=>{
                if(test.testCategory){
                    test.testCategory.map((cat)=>{
                        if(cat._id === id){
                            testObj.push(test)
                            settests(tests => [...tests,test]);
                        }

                    })
                }
            })
            
        }  
        console.log('newtestPricenewtestPrice',testObj);
    }
    const gettests = async (start,end) =>{
        
        await API.get(`/test/${start}/${end}?_order=DESC`).then(({ data = {} }) => {
            if(data.length !== 0){
                // Block.circle('.testList');
                
                getCategoryById(data);
            }else{
                // Block.remove('.testList');
                Loading.remove();
                loop = false;
            }
                
              });
    }
    const handlerSelecttest = (pro) =>{
        setSelectedtests(selecttests =>[...selecttests,pro])
    }
    const onSuccessHandler = async (value) =>{
        if(value){
            settests([]);
            Loading.pulse();
            let start = 0;
            let end = 99;
            while(loop){
                await  gettests(start,end).then(()=>{
                    start+=100;
                    end+=100;
                }).catch(()=>{
                    loop = false
                });
                    
            }
        }
    }
    React.useEffect(async ()=>{
        Loading.pulse();
        let start = 0;
        let end = 99;
        while(loop){
               await  gettests(start,end).then(()=>{
                start+=100;
                end+=100;
               }).catch(()=>{
                loop = false
               });
                
        }
        
    },[])
    return (
        [<Create {...props}>
            <ChangesForm selectedtest={selecttests} data={tests} onSuccess={onSuccessHandler}/>
        </Create>,
    //    <List resource={'test'} >
    <Card className={"width1000"} style={{marginTop:'20px'}}>
    <CardHeader title={'  تعداد محصولات  این دسته بندی  ' +tests.length + 'محصول'}/> <span>{}</span>
    <CardContent>
      <div style={{ height: "auto"}} className={"order-chart"}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>محصول</TableCell>
                <TableCell align="right">قیمت</TableCell>
                {/*<TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
                {/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody className='testList'>
              {
                tests ? (
                    tests.map((row,index) => (
                      <TableRow
                        style={{cursor:'pointer'}}
                      className={'pID-'+row._id}
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                inputProps={{
                                'aria-label': 'select all desserts',
                                }}
                                onChange={(e)=> e.target.checked && handlerSelecttest(row)}
                            />
                            </TableCell>
                        <TableCell component="th" scope="row">
                          {row.title.fa}
                        </TableCell>
                        <TableCell align="right">
                            <PriceFiled test={row} key={index}/>
                        </TableCell>
                        
                      </TableRow>
                    ))
                ):(
                    <span>Loading......</span>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </CardContent>
  </Card>
    //    </List>
               
            ]
    );
}
const PriceFiled = (props) =>{
    const {test} = props;

                                           let tt = 'نا موجود', thecl = 'erro';
                                           if (test.type == 'variable') {

                                               if (test.combinations) {
                                                   test.combinations.map((comb, key) => {
                                                       if (comb.in_stock == true) {
                                                           tt = 'موجود';
                                                           thecl = 'succ';
                                                       }
                                                   });
                                                   return (
                                                       <div className='stockandprice'>

                                                           <div className='theDate hoverparent'>
                                                               <Chip className={thecl} label={tt}></Chip>
                                                               <div className='theDate thehover'>
                                                                   {test.combinations.map((comb, key) => {
                                                                       return (
                                                                           <div className={'cobm flex-d cobm' + key} key={key}>
                                                                               <div className={'flex-1'}>
                                                                                   {comb.options && <div
                                                                                       className={''}>{Object.keys(comb.options).map((item, index) => {
                                                                                       return <div
                                                                                           key={index}>{(item) + " : " + comb.options[item] + "\n"}</div>;

                                                                                   })}</div>}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {comb.price &&
                                                                                   <div className={'FDFD'}>
                                                                                       <span>قیمت:</span><span>{comb.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                   </div>}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {comb.salePrice &&
                                                                                   <div className={'vfdsf'}>
                                                                                       <span>قیمت تخفیف خورده:</span><span>{comb.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                                                   </div>}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {/*{comb.in_stock &&*/}
                                                                                   {/*<div className={''}>*/}
                                                                                   {/*<span>{(comb.in_stock == true ? 'موجود' : 'نا موجود')}</span>*/}
                                                                                   {/*</div>}*/}
                                                                               </div>
                                                                               <div className={'flex-1'}>

                                                                                   {/*{comb.quantity &&*/}
                                                                                   {/*<div className={''}>*/}
                                                                                   {/*<span>{comb.quantity}</span>*/}
                                                                                   {/*</div>}*/}
                                                                               </div>
                                                                           </div>);
                                                                   })}
                                                               </div>
                                                           </div>
                                                       </div>
                                                   );

                                               }

                                           } else {
                                               if (test.in_stock == true) {
                                                   tt = 'موجود';
                                                   thecl = 'succ';
                                               }
                                               return (<div className={'cobm flex-d cobm'}>
                                                   <div className={'flex-1'}>
                                                       <span>قیمت:</span><span>{test.price && test.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>با تخفیف:</span><span>{test.salePrice && test.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>انبار:</span><span><Chip className={thecl}
                                                                                      label={tt}></Chip></span>
                                                   </div>
                                                   <div className={'flex-1'}>
                                                       <span>تعداد:</span><span>{test.quantity}</span>
                                                   </div>
                                               </div>)

                                           }

   
}
export default React.memo(testCategoryShow);
