import {
  Datagrid,
  DeleteButton, downloadCSV,
  EditButton,
  Filter,
  FunctionField,
    ReferenceField,
    ChipField,
  Pagination,
  SearchInput,
  TextField, TextInput,
  useTranslate,
  DateInput,DateField
} from "react-admin";

import API, { BASE_URL } from "@/functions/API";
import { dateFormat } from "@/functions";
import {
  CatRefField,
  EditOptions,
  FileChips,
  List,
  ShowDescription,
  showFiles,
  ShowLink,
  ShowOptions,
  ShowPictures,
  SimpleForm,
  ReactAdminJalaliDateInput,
  SimpleImageField,
  UploaderField
} from "@/components";
import { Button } from "@mui/material";
import jsonExport from "jsonexport/dist";
import React from "react";
import moment from "jalali-moment";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;


const postRowStyle = (record, index) => {

  return ({
    backgroundColor: "#ee811d"
  });
};
const exporter = posts => {
  let allpros = [];
  const postsForExport = posts.map((post, i) => {
    const { backlinks, author, ...postForExport } = post; // omit backlinks and author
    postForExport._id = post._id; // add a field
    allpros.push({
      _id: post._id,
      title: post.title,
      slug: post._id,
      createdAt: (post.createdAt),
      updatedAt: (post.updatedAt),
      status: (post.status),
      active: (post.active),
      view: (post.view),
    });
  });
  jsonExport(allpros, {
    headers: ["_id", "title", "slug", "date", "createdAt", "updatedAt","status","active","view"] // test fields in the export
  }, (err, csv) => {
    const BOM = "\uFEFF";
    downloadCSV(`${BOM} ${csv}`, "tests"); // download as 'posts.csv` file
  });
};

const PostFilter = (props) => {
  const translate = useTranslate();
  return (
    <Filter {...props}>
      <SearchInput source="Search" placeholder={translate("resources.test.search")} alwaysOn/>
      <SearchInput source="category" placeholder={translate("resources.test.category")} alwaysOn/>

      <ReactAdminJalaliDateInput
        fullWidth
        source="createdAt" label={translate("resources.order.date_gte")}
        testat={testValue => moment.from(testValue, "fa", "jYYYY/jMM/jDD").testat("YYYY-MM-DD")}
        parse={inputValue => moment.from(inputValue, "fa", "jYYYY/jMM/jDD").testat("YYYY-MM-DD")}
      />
      <TextInput
        fullWidth
        source="createdAt" label={translate("resources.order.date_gte")}
      />
      <ReactAdminJalaliDateInput
        fullWidth
        source="updatedAt" label={translate("resources.order.date_lte")}
        testat={testValue => moment.from(testValue, "fa", "jYYYY/jMM/jDD").testat("YYYY-MM-DD")}
        parse={inputValue => moment.from(inputValue, "fa", "jYYYY/jMM/jDD").testat("YYYY-MM-DD")}
      />
      <TextInput
        fullWidth
        source="updatedAt" label={translate("resources.order.date_lte")}
      />

    </Filter>
  );
};


const list = (props) => {
  // console.log("prooooooooo",props);
  const translate = useTranslate();
  // rowStyle={postRowStyle}
  return (

    <List  {...props} filters={<PostFilter/>} pagination={<PostPagination/>} exporter={exporter}>
      <Datagrid optimized>

        <TextField source={"title."+translate('lan')} label={translate("resources.test.title")}/>
        {/*<TextField source={"title"} label={translate("resources.test.title")}/>*/}
        <TextField source="slug" label={translate("resources.test.slug")}/>
          <ReferenceField
              label={translate('resources.test.category')}
              source="category"
              reference="testCategory">
              <TextField source={"name."+translate('lan')}/>
          </ReferenceField>


        <FunctionField label={translate("resources.test.date")}
                       render={record => (
                         <div className='theDate'>
                           <div>
                             {translate("resources.test.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                           </div>
                           <div>
                             {translate("resources.test.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                           </div>

                           {record.view && <div>
                             {translate("resources.test.viewsCount") + ": " + `${(record.view)}`}
                           </div>}
                         </div>
                       )}/>
        <FunctionField label={translate("resources.test.actions")}
                       render={record => (<div>
                         <div>
                           {/*+"?token="+localStorage.getItem('token')*/}
                           <a target={"_blank"}
                              href={"/admin/#/builder" + "/test/" + record._id}>{translate("resources.test.pagebuilder")}</a>
                         </div>
                         <div>
                           <EditButton/>
                         </div>
                         <div>
                           <Button
                             color="primary"
                             size="small"
                             onClick={() => {
                               // console.log('data', record._id);
                               API.post("/test/copy/" + record._id, null)
                                 .then(({ data = {} }) => {
                                   // console.log('data', data._id);
                                   props.history.push("/post/" + data._id);
                                   // ale/rt('done');
                                 })
                                 .catch((err) => {
                                   console.log("error", err);
                                 });
                             }}>
                             {translate("resources.test.copy")}
                           </Button>
                         </div>
                         <div>
                           <DeleteButton/>
                         </div>
                       </div>)}/>
      </Datagrid>
    </List>
  );
};

export default list;
