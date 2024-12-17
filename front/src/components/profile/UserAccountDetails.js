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

import store from '#c/functions/store';
import { dateFormat } from '#c/functions/utils';
import { getMe, Logout, submitProfile } from '#c/functions';

export default function UserAccountDetails({ title }) {
  const { t } = useTranslation();
  const st = store.getState().store.user;
  const registerExtraFields= store.getState().store.themeData?.registerExtraFields;
  console.log('registerExtraFields: ', registerExtraFields)
  const [state, setState] = useState({
    newDomain:'',
    filled: false,
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
  const submitForm = () => {
    const { phoneNumber, firstName, lastName, webSite, internationalCode, email, data } =
      state;
    if (!phoneNumber) return;
    submitProfile({
      phoneNumber,
      firstName,
      lastName,
      email,
      internationalCode,
      data,
    })
      .then((d) => {
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
        {expireDate && (
          <span className="etebar">
            <span>{t('accountCharge')}:</span>
            <span>{dateFormat(expireDate, 'YYYY/MM/DD')}</span>
          </span>
        )}
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                {!editMode && <>
                  {(firstName || lastName) && <Row form className={'row'}>
                  {/* First Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">{t('name')}: {firstName}</label>

                  </Col>
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feLastName">{t('last name')}: {lastName}</label>

                  </Col>
                </Row>}
                  {(internationalCode || email) && <Row form className={'row'}>
                  {/* First Name */}
                    {internationalCode && <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">
                      {t('International Code')}: {internationalCode}
                    </label>

                  </Col>}
                  {/* Last Name */}
                    {email && <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">{t('Email')}: {email}</label>

                  </Col>}
                </Row>}
                {(phoneNumber || webSite) && (
                <Row form className="row">
                  {/* Phone Number */}
                  {phoneNumber && (
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">
                        {t('phone number')}: {phoneNumber}
                      </label>
                    </Col>
                  )}

                  {/* Website */}
                  {webSite?.length > 0 && (
                    <Col md="6" className="form-group">
                      <label htmlFor="feWebsite">
                        {t('Website')}:{' '}
                        {webSite.map((item, index) => (
                          <span key={index}>{`${item.title}.nodeeweb.com`}</span>
                        ))}
                      </label>
                    </Col>
                  )}
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
                {editMode && <>
                <Row form className={'row'}>
                  {/* First Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">{t('name')}</label>
                    <FormInput
                      id="feFirstName"
                      placeholder={t('name')}
                      value={firstName}
                      onChange={(e) => {
                        setState({
                          ...state,
                          firstName: e.target.value,
                        });
                      }}
                    />
                  </Col>
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feLastName">{t('last name')}</label>
                    <FormInput
                      id="feLastName"
                      placeholder={t('last name')}
                      value={lastName}
                      onChange={(e) => {
                        setState({
                          ...state,
                          lastName: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row form className={'row'}>
                  {/* First Name */}
                  {registerExtraFields  && registerExtraFields.map((item)=>{
                    console.log("itemmmm", item)
                      if(item?.name =='internationalCode'){
                        return <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">
                    {item?.label} :{data[item?.name]}
                    </label>
                    <FormInput
                      id="juyghj"
                      placeholder={t('00xxxxxxxx')}
                      value={internationalCode}
                      onChange={(e) => {
                        setState({
                          ...state,
                          internationalCode: e.target.value,
                        });
                      }}
                    />
                  </Col>}
                })}
                  {/* Last Name */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feFirstName">{t('Email')}</label>
                    <FormInput
                      id="juyghj"
                      placeholder={t('example@gmail.com')}
                      value={email}
                      onChange={(e) => {
                        setState({
                          ...state,
                          email: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row form className={'row'}>
                  {/* Password */}
                  <Col md="6" className="form-group">
                    <label htmlFor="feLastName">{t('phone number')}</label>
                    <FormInput
                      placeholder={t('phone number')}
                      value={phoneNumber}
                      disabled
                      onChange={(e) => {
                        setState({
                          ...state,
                          phoneNumber: e.target.value,
                        });
                      }}
                    />
                  </Col>
                  {webSite.length > 0 && (
                    <Col md="6" className="form-group">
                      <label htmlFor="feWebsite">{t('Website')}</label>
                      {webSite.map((item, key) =>{
                        return (
                            <FormInput
                            key= {key}
                            placeholder={t('Website')}
                            value={`${item.title}.nodeeweb.com`}
                            disabled
                          />
                        )
                      })}

                    </Col>
                  )}

<Col md="12" className="form-group">
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setState({ ...state, addingWebsite: true })}
  >
    {t('Add Website')}
  </button>
</Col>

{/* Website Submission Form */}
{state.addingWebsite && (
  <Col md="12" className="form-group">
    <FormInput
      id="newWebsite"
      placeholder={t('Enter Domain')}
      value={state.newWebsite || ''}
      onChange={(e) => setState({ ...state, newWebsite: e.target.value })}
    />
    <button
      type="button"
      className="btn btn-success mt-2"
      onClick={() => {
        // Add new website to the list
        setState({
          ...state,
          goToCreateWebsite: true,
          addingWebsite: false,
        });
      }}
      disabled={!state.newWebsite?.trim()}
    >
      {t('Submit Domain')}
    </button>
  </Col>
)}

                </Row>

                  <Row form className={'row'}>
                    {/* Password */}
                    {/*{JSON.stringify(registerExtraFields)}*/}
                    {registerExtraFields && registerExtraFields.map((item)=>{
                    if(item?.name!='internationalCode')
                      return <Col md="6" className="form-group">
                      <label htmlFor="feLastName">{item?.label}</label>
                      <FormInput
                        placeholder={item?.label}
                        value={data[item?.name]}
                        disabled={item?.disabled}
                        onChange={(e) => {
                          let d={...data}
                          d[item?.name]=e.target.value
                          setState({
                            ...state,
                            data: {...d},
                          });
                        }}
                      />
                    </Col>

                      }
                    )}
                  </Row>
                </>}
                <Row>
                  <Col className="mgt10"></Col>
                </Row>
                <Row className={'row'}>
                  <Col>
                    {editMode && <Button theme="accent" onClick={submitForm}>
                      {t('update')}
                    </Button>}
                    {!editMode && <Button theme="accent" onClick={enableEditMode}>
                      {t('edit')}
                    </Button>}
                  </Col>
                  <Col>
                    {!editMode && <Button theme="error" className="dfg ml-2" onClick={Logout}>
                      {t('logout')}
                    </Button>}
                    {editMode && <Button theme="error" className="dfg ml-2" onClick={disableEditMode}>
                      {t('cancel')}
                    </Button>}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
  // }
}
