import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Col,
  Form,
  FormInput,
  ListGroup,
  ListGroupItem,
  Row,
} from 'shards-react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import store from '#c/functions/store';
import { dateFormat } from '#c/functions/utils';
import { getMe, Logout, submitProfile } from '#c/functions';

export default function MyWebsites({ title }) {
  const { t } = useTranslation();
  const st = store.getState().store.user;
  const registerExtraFields= store.getState().store.themeData?.registerExtraFields;
  console.log('registerExtraFields: ', registerExtraFields)
  const [state, setState] = useState({
    newWebsite:'',
    filled: false,
    addingWebsite: false,
    goToCreateWebsite: false,
    phoneNumber: st.phoneNumber,
    firstName: st.firstName,
    lastName: st.lastName,
    email: st.email,
    webSite: st.webSite,
    editMode:false,
    data: {},
    internationalCode: st.internationalCode,
  });
  const [stateregisterExtraFields, setStateregisterExtraFields] = useState(registerExtraFields);
  const [isInternationalCode, setIsInternationalCode] = useState(true);

  const enableEditMode = () => {
    setState({
      ...state,
      editMode:true
    });
  }
  const disableEditMode = () => {
    setState({
      ...state,
      editMode:false
    });
  }
  const submitForm = (e) => {
    e.preventDefault();
    const { newWebsite } =
      state;
    console.log('newWebsite: ', newWebsite)

    if (!newWebsite) return;
    submitProfile({
      webSite: {title: newWebsite}
    })
      .then((d) => {
        setState({ ...state, goToCreateWebsite: true })
        toast.success(t('successfully done!'));
        return;
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data && data.customer)
          setState({
            filled: true,
            phoneNumber: data.customer.phoneNumber,
            webSite: data.customer.webSite,
            firstName: data.customer.firstName,
            lastName: data.customer.lastName,
            email: data.customer.email,
            data: data.customer.data,
            internationalCode: data.customer.internationalCode,
          });
      })
      .catch((e) => {});
  }, []);

  const {
    phoneNumber,
    firstName,
    lastName,
    internationalCode,
    goToCreateWebsite,
    webSite,
    email,
    editMode,
    addingWebsite,
    newWebsite,
    data = {},
  } = state;

  const { expireDate } = data;
  if (!(firstName && lastName)) return <Navigate to={'/login'} />;
  if ((goToCreateWebsite)) return <Navigate to={`/webSiteBuilder?newDomain=${newWebsite}`} />;
  console.log('web site : ', webSite)
  return (
    <Card small className="mb-  4">
      <CardHeader className="border-bottom d-flex jsb">
        <h6 className="m-0">{title}</h6>
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setState({ ...state, addingWebsite: true })}
  >
    {t('Add Website')}
  </button>

      </CardHeader>
      {addingWebsite && (
  <Row><Col md="6" className="form-group">
    <FormInput
    className="mt-2 mr-2"
      id="newWebsite"
      placeholder={t('Enter Website')}
      value={newWebsite}
      onChange={(e) => setState({ ...state, newWebsite: e.target.value })}
    />
    </Col>
    <Col md='6'>
    <button
      type="button"
      className="btn btn-success mt-2"
      onClick={submitForm}
      disabled={!state.newWebsite?.trim()}
    >
      {t('Submit Website')}
    </button>
    <button
      type="button"
      className="btn btn-success mt-2 mr-2"
      onClick={() => {
        // Add new website to the list
        setState({
          ...state,
          addingWebsite: false,
        });
      }}
    >
      {t('cancel')}
    </button>
  </Col>
  </Row>
)}
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                {!editMode && <>
                  {/* Website */}
                  {(webSite?.length > 0 && !addingWebsite) && (
                <Row form className="row">


                        {webSite.map((item, index) => (
                                              <Col md="12" className="form-group d-flex justify-content-between">
                      <label htmlFor="feWebsite">
                          <span key={index}>{`${item.title}.nodeeweb.com`}</span>
                          </label>
                      <EditIcon />
                    </Col>
                        ))}

                </Row>

                  )}

                  {registerExtraFields && <Row>{registerExtraFields.map((item)=>{
                      if(item?.name!='internationalCode')
                        return <Col md="6" className="form-group">
                          <label htmlFor="feLastName">{item?.label} :{data[item?.name]}</label>

                        </Col>

                    }
                  )}</Row>}
                </>}
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
  // }
}
