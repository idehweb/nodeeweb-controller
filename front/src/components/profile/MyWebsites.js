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
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import store from '#c/functions/store';
import { dateFormat } from '#c/functions/utils';
import { getMe, Logout, submitProfile ,getSessionInfo, checkDomainIsAvailable, addDomain} from '#c/functions';

export default function MyWebsites({ title }) {
  const { t } = useTranslation();
  const st = store.getState().store.user;
  const registerExtraFields= store.getState().store.themeData?.registerExtraFields;
  console.log('registerExtraFields: ', registerExtraFields)
  const [state, setState] = useState({
    newWebsite:'',
    filled: false,
    addingWebsite: false,
    editWebsite: null,
    sessionId: '',
    domain: '',
    addingDomain: false,
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
    const { newWebsite , sessionId} =
      state;
    console.log('newWebsite: ', newWebsite)

    if (!newWebsite) return;
    checkDomainIsAvailable({webSite: {title: newWebsite}, sessionId:sessionId}).then((r) => {
      if (r.success){
        if(r.message.error){
          console.log('already exist')
          toast.error(t('website already exist!'))
        } else{
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
          toast.error(t('enter another name for your website pls'))

            });
        }
      } else {
        toast.error(t('enter another name for your website pls'))
      }
    }).catch((err) => {
      console.log('err',err)
    })

  };
  const submitDomain = (e, item ,domain) => {
    // let{domain} = state
    if(!domain) return
    e.preventDefault();
    console.log('item: ', item)
    console.log(`select domain with name ${domain} for this website ${item.title}`)
    addDomain({
      domain: domain,
      title: item.title
    })
      .then((d) => {
        // setState({ ...state, goToCreateWebsite: true })
        if (d.success){
          toast.success(t(`domain generated successfully for website ${item.title}!`));
          return;
        } else {
          toast.error(t('error for generating domain'))
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  useEffect(() => {
        getSessionInfo().then((r)=>{
          setState({
            ...state, sessionId: r?.sessionInfo?.sessionID
          })
        })
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
    editWebsite,
    webSite,
    domain,
    addingDomain,
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
      style={{ direction: 'ltr' }}
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
                  {/* Website */}
                  {(webSite?.length > 0 && !addingWebsite) && (<>
                        {webSite.map((item, index) => (
                                          <Row className='border-bottom pb-2' key={index}>    <Col md="12" className="d-flex justify-content-between">
                      <label style={{display: 'flex', alignItems: 'center'}} htmlFor="feWebsite">
                          <span >{`${item.title}.nodeeweb.com`}</span>
                          </label>
                      <button className='btn py-1'
                        onClick={(e) => {e.preventDefault(); setState({ ...state, editWebsite: state.editWebsite === index ? null : index })}}
                      >
                      <EditIcon />
                      </button>
                    </Col>
                    {editWebsite === index && 
                      <Col md="12" className="d-flex justify-content-start">
{addingDomain !== index  &&                       <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => setState({ ...state, addingDomain: addingDomain === index ? null : index })}
                        >
                         <AddIcon fontSize='small'/> {t('Add Domain')}
                        </button>}
                        {addingDomain === index && (
  <Row><Col md="6" className="form-group">
    <FormInput
    className="mt-2 mr-2 form-control-sm"
      id="newWebsite"
      placeholder={t('example.com')}
      value={domain}
      style={{ direction: 'ltr' }}
      onChange={(e) => setState({ ...state, domain: e.target.value })}
    />
    </Col>
    <Col md='6'>
    <button
      type="button"
      className="btn-sm btn btn-success mt-2"
      onClick={(e) =>{ submitDomain(e, item, domain); setState({ ...state, domain: ''})}}
      disabled={!domain?.trim()}
    >
      {t('Submit Domain')}
    </button>
    <button
      type="button"
      className="btn-sm btn btn-success mt-2 mr-2"
      onClick={() => {
        // Add new website to the list
        setState({
          ...state,
          addingDomain: false,
        });
      }}
    >
      {t('cancel')}
    </button>
  </Col>
  </Row>
)
                        
                        }
                      </Col>


                        }
                    </Row>
                        ))}
</>

                  )}
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
  // }
}
