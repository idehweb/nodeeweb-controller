import React, { useEffect, useState } from 'react';
// import warrantyIcon from window.location.origin + '/assets/warranty.png'
import LoadingContainer from '@/components/common/LoadingContainer';
import CreateForm from '@/components/form/CreateForm';
import _get from 'lodash/get';
import clsx from 'clsx';

import {
  Badge,
  Button,
  ButtonGroup,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'shards-react';
import { Link, useParams } from 'react-router-dom';
import Gallery from '#c/components/single-post/Gallery';
import {
  WarrantyIcon,
  SecurityIcon,
  PersonInIcon,
  ImideatlyIcon,
} from '#c/components/single-post/base';
import Theprice from '#c/components/single-post/Theprice';
import SidebarActions from '#c/components/single-post/SidebarActions';
import RelatedProducts from '#c/components/single-post/RelatedProducts';
import Comments from '#c/components/single-post/Comments';
import { withTranslation } from 'react-i18next';
import { dFormat, PriceFormat } from '#c/functions/utils';

import {
  addBookmark,
  clearPost,
  getPost,
  isClient,
  loadProduct,
  loveIt,
  MainUrl,
  setStyles,
  submitForm,

  getTest,
  savePost,
  getThemeData,
} from '#c/functions/index';
import { SnapChatIcon } from '#c/assets/index';
import Loading from '#c/components/Loading';
import store from '../functions/store';
import { useSelector } from 'react-redux';
import CONFIG from '#c/config';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
// import { Link, useNavigate, useParams } from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentsIcon from '@mui/icons-material/Payments';
import VerifiedIcon from '@mui/icons-material/Verified';
// let obj = ;
import { toast } from 'react-toastify';
// let the_id='';
import { RWebShare } from 'react-web-share';

import DescriptionIcon from '@mui/icons-material/Description';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import ReviewsIcon from '@mui/icons-material/Reviews';
import {useCallback} from "react";

const Test = (props) => {
  let { match, location, history, t, url } = props;

  let product = useSelector((st) => {
    return st.store.product || [];
  });
  const [theFormFields, setFormFields] = useState(null);
  const [DATA, setData] = useState([]);

  // window.scrollTo(0, 0);
  let params = useParams();
  // return;
  let the_id = params._id || params._product_slug;
  // let search = false;
  // let history = useNavigate();

  let st = store.getState().store;
  let fp = localStorage.getItem('username');
  // return JSON.stringify(fp)
  let admin_token = null;
  if (fp) {
    admin_token = fp;
  }
  const [loading, setLoading] = useState(true);

  const [mainId, setMainId] = useState(the_id);
  const [tab, setTab] = useState('attributes');
  const [state, setState] = useState(isClient ? [] : product || []);
  const [lan, setLan] = useState(store.getState().store.lan || 'fa');
  const [requiredWarranty, setRequiredWarranty] = useState(true);
  // const [enableAdmin] = useState(store.getState().store.enableAdmin || false);
  let { data = {} } = {};
  // const fields = _get(element, 'settings.general.fields', {});

  // const { _id = '' } = fields;

  const getTheTest = (_id) => {
    return new Promise(function (resolve, reject) {
      getTest(_id).then((d = {}) => {
        let resp=d
        console.log("resp",resp)
        const { elements } = resp;

        let formValues = [];
        let formFields = [];

        elements?.forEach((d) => {
          console.log("d",d)
          const fields = _get(d, 'settings.general.fields', {});
          const { children } = d;

          const {
            name,
            label,
            value = '',
            placeholder,
            classes,
            options,
            showStepsTitle,
            required,
          } = fields;
          console.log("fields",fields)

          formFields[name] = value;
          let theChildren = [];
          if (children) {
            console.log("children",children)
            children.forEach((ch) => {
              // theChildren.push(lastObj);
              theChildren.push(ch);
            });
          }
          // console.log(classes)
          let lastObj = {
            type: d.name || 'string',
            label: label || name,
            name: name,
            showStepsTitle: showStepsTitle,
            size: {
              sm: 6,
              lg: 6,
            },
            onChange: (text) => {
              // setFields([...fields,])
              // this.state.checkOutBillingAddress.add.data[d] = text;
            },
            style: setStyles(fields),
            className: clsx(
              'rtl',
              classes
            ),
            placeholder: placeholder,
            child: [],
            children: children || [],
            options: options || [],
            value,
            required: Boolean(required) || false,
          };
          if (typeof data[d] == 'object') lastObj.type = 'object';

          if (typeof data[d] == 'number') lastObj.type = 'number';

          if (typeof data[d] == 'string') {
          }

          formValues.push(lastObj);
        });
        console.log("formFields",formFields)
        console.log("formValues",formValues)
        setFormFields({ ...formFields });
        setData([...formValues]);
        resolve({
          load: true,
          title: d.title,
          classes: d.classes,
          elements: d.elements,
          description: d.description,
          lyrics: d.lyrics,
          files: d.files,
          photos: d.photos,
          _id: d._id,
          extra_button: d.extra_button,
          customer: d.customer,
          catChoosed: d.catChoosed,
          countryChoosed: d.countryChoosed,
          weight: d.weight,
          updatedAt: d.updatedAt,
          nextPost: d.nextPost,
          type: d.type,
          price: d.price,
          salePrice: d.salePrice,
          allPostData: d.data,
          questions: d.questions,
          firstCategory: d.firstCategory,
          secondCategory: d.secondCategory,
          thirdCategory: d.thirdCategory,
          sections: d.sections,
          options: d.options,
          in_stock: d.in_stock,
          quantity: d.quantity,
          thumbnail: d.thumbnail,
          labels: d.labels,
          excerpt: d.excerpt,
          categories: d.categories,
          extra_attr: d.extra_attr,
          views: d.views,
          like: d.like,
          combinations: d.combinations,
        });
      }).finally(() => setLoading(false));
    });
  };

  if (isClient)
    useEffect(() => {
      // let mounted = true;
      let { _id, title } = params;
      getTheTest(the_id).then((items) => {
        setState(items);
        if (isClient) window.scrollTo(0, 0);
        // }
      });
      // return () => mounted = false;
    }, [the_id]);
  const handleSubmit = useCallback(
    async (v) => {
      setLoading(true);
      const values = { ...v };
      for (let key in values) {
        const value = values[key];
        if (value instanceof File) {
          const url = await handleUpload(value);
          values[key] = `${MainUrl}/${url}`;
        }
      }

      submitForm(_id, values)
        .then((d) => {
          if (d.success && d.message) {
            toast.success(t(d.message));
            const form = document.getElementById(_id);
            if (form) form.reset();
          }
        })
        .catch((e) => {
          console.error('err=>', e);
          toast.error(t('sth wrong happened!'));
        })
        .finally(() => setLoading(false));
    },
    [the_id, t]
  );
  // useEffect(() => {
  //   let { _id, title } = params;
  //   // if (mainId != _id) {
  //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
  //   window.scrollTo(0, 0);
  //   // }
  //
  // }, [the_id]);

  let {
    labels,
    load,
    title,
    description,
    photos,
    redirect,
    classes,
    price,
    salePrice,
    // _id,
    elements,
    customer,
    type,
    updatedAt,
    weight,
    countryChoosed,
    firstCategory,
    secondCategory,
    thirdCategory,
    sections,
    categories,
    combinations,
    options,
    quantity,
    thumbnail,
    extra_button,
    in_stock,
    extra_attr,
    excerpt,
    like,
    views = null,
  } = state;
  if (redirect && isClient) return <Navigate to={redirect} />;
  if (!load && isClient) return <Loading />;

  return [
    <Container
      className={"main-content-container p-0 kiuytyuioiu"}
    >
      <Row className={'justify-end '+classes}>
        {/*{JSON.stringify(theFormFields)}*/}
        {/*{JSON.stringify(DATA)}*/}

        <LoadingContainer
          loading={loading}
          style={{ position: 'relative', minHeight: 400 }}>
          {theFormFields && DATA && (
            <CreateForm
              // formFieldsDetail={fields}
              rules={{ fields: DATA }}
              onSubmit={handleSubmit}
              buttons={[]}
              theFields={DATA}
              fields={theFormFields}
            />
          )}
        </LoadingContainer>
      </Row>
    </Container>
  ];
};

export default withTranslation()(Test);
