/* eslint-disable react/jsx-pascal-case */
import { MenuItemLink, useTranslate } from 'react-admin';
import { Dashboard, MoreHoriz } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';
import { Box } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import * as RSList from '@/resource';
import { ExcludeList } from '@/data/models';

import SubMenu from './SubMenu';
import { useEffect, useState } from 'react';

export default function Menu({ onMenuClick, dense = false }) {
  // @ts-ignore
  const themeData = useSelector((st) => st.themeData);

  const translate = useTranslate();

  const ModelList = _get(themeData, 'models', []) || [];
  const learn_mode = _get(themeData, 'learn_mode', []) || [];
  const [clientMode, setClientMode] = useState(localStorage.getItem('client_mode')); // Default mode is 'advanced'
  const isSimple = clientMode == 'simple'


  return (
    <Box
      sx={{
        width: 240, // drawer width
        '& svg': { color: 'var(--primary)' },
      }}>
      {!isSimple && ( <>
        <MenuItemLink
        to="/"
        primaryText={translate('pos.menu.dashboard')}
        leftIcon={<Dashboard />}
        dense={dense}
        className="vas"
      />

      <SubMenu
        name="media"
        label={translate('pos.menu.medias')}
        icon={<RSList.Media.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/media/create' }}
          primaryText={translate('pos.menu.addMedia')}
          leftIcon={<RSList.Media.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/media' }}
          primaryText={translate('pos.menu.allMedias')}
          leftIcon={<RSList.Media.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/document/create' }}
          primaryText={translate('pos.menu.addDocument')}
          leftIcon={<RSList.Document.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/document' }}
          primaryText={translate('pos.menu.allDocuments')}
          leftIcon={<RSList.Document.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu

        name="sections"
        label={translate('pos.menu.shop')}
        icon={<ShoppingBasketIcon />}
        dense={dense}>
        <SubMenu
          name="product"
          label={translate('pos.menu.products')}
          icon={<RSList.Product.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/product/create' }}
            primaryText={translate('pos.menu.addProduct')}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/product' }}
            primaryText={translate('pos.menu.allProducts')}
            dense={dense}
          />
        </SubMenu>

        <SubMenu
          name="sections"
          label={translate('pos.menu.attributes')}
          icon={<RSList.Attributes.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/attributes/create' }}
            primaryText={translate('pos.menu.addAttribute')}
            // leftIcon={<ResourcesList.Attributes.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/attributes' }}
            primaryText={translate('pos.menu.allAttributes')}
            // leftIcon={<ResourcesList.Attributes.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          name="sections"
          label={translate('pos.menu.category')}
          icon={<RSList.ProductCategory.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/productCategory/create' }}
            primaryText={translate('pos.menu.addCategory')}
            // leftIcon={<ResourcesList.ProductCategory.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/productCategory' }}
            primaryText={translate('pos.menu.allCategories')}
            // leftIcon={<ResourcesList.ProductCategory.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          name="sections"
          label={translate('pos.menu.discount')}
          icon={<RSList.Discount.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/discount/create' }}
            primaryText={translate('pos.menu.addDiscount')}
            // leftIcon={<ResourcesList.ProductCategory.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/discount' }}
            primaryText={translate('pos.menu.allDiscounts')}
            // leftIcon={<ResourcesList.ProductCategory.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          name="order"
          label={translate('pos.menu.orders')}
          icon={<RSList.Order.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/order' }}
            primaryText={translate('pos.menu.allOrders')}
            // leftIcon={<ResourcesList.Order.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/ordercart' }}
            primaryText={translate('pos.menu.cart')}
            // leftIcon={<ResourcesList.OrderCart.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/order/create' }}
            primaryText={translate('pos.menu.addOrder')}
            // leftIcon={<ResourcesList.OrderCart.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          name="transaction"
          label={translate('pos.menu.transactions')}
          icon={<RSList.Transaction.icon />}
          dense={dense}>
          <MenuItemLink
            to={{ pathname: '/transaction/create' }}
            primaryText={translate('pos.menu.addOrderLink')}
            // leftIcon={<ResourcesList.OrderCart.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{ pathname: '/transaction' }}
            primaryText={translate('pos.menu.allTransactions')}
            // leftIcon={<ResourcesList.Transaction.icon/>}
            dense={dense}
          />
        </SubMenu>
        </SubMenu>
      <SubMenu
        name="form"
        label={translate('pos.menu.forms')}
        icon={<DynamicFormIcon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/form/create' }}
          primaryText={translate('pos.menu.addForm')}
          leftIcon={<DynamicFormIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/form' }}
          primaryText={translate('pos.menu.allForms')}
          leftIcon={<CheckBoxIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/entry' }}
          primaryText={translate('pos.menu.allEntries')}
          leftIcon={<DocumentScannerIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/entry/create' }}
          primaryText={translate('pos.menu.addEntry')}
          leftIcon={<NoteAddIcon />}
          dense={dense}
        />
      </SubMenu>

        {learn_mode && <SubMenu
            name="learn"
            label={translate('pos.menu.learn')}
            icon={<DynamicFormIcon />}
            dense={dense}>
            <MenuItemLink
                to={{ pathname: '/course/create' }}
                primaryText={translate('pos.menu.addCourse')}
                leftIcon={<DynamicFormIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/course' }}
                primaryText={translate('pos.menu.allCourses')}
                leftIcon={<CheckBoxIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/courseCategory/create' }}
                primaryText={translate('pos.menu.addCourseCategory')}
                leftIcon={<DynamicFormIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/courseCategory' }}
                primaryText={translate('pos.menu.allCourseCategory')}
                leftIcon={<CheckBoxIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/test' }}
                primaryText={translate('pos.menu.allTests')}
                leftIcon={<DocumentScannerIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/test/create' }}
                primaryText={translate('pos.menu.addTest')}
                leftIcon={<NoteAddIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/testCategory' }}
                primaryText={translate('pos.menu.allTestCategory')}
                leftIcon={<DocumentScannerIcon />}
                dense={dense}
            />
            <MenuItemLink
                to={{ pathname: '/testCategory/create' }}
                primaryText={translate('pos.menu.addTestCategory')}
                leftIcon={<NoteAddIcon />}
                dense={dense}
            />
        </SubMenu>}

      <SubMenu
        name="customer"
        label={translate('pos.menu.customers')}
        icon={<RSList.Customer.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/customer/create' }}
          primaryText={translate('pos.menu.addCustomer')}
          leftIcon={<RSList.Customer.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/customer' }}
          primaryText={translate('pos.menu.allCustomers')}
          leftIcon={<RSList.Customer.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/customerGroup' }}
          primaryText={translate('pos.menu.allCustomerGroup')}
          leftIcon={<EmojiEmotionsIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/customerGroup/create' }}
          primaryText={translate('pos.menu.addCustomerGroup')}
          leftIcon={<AddReactionIcon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        name="users"
        label={translate('pos.menu.users')}
        icon={<RSList.User.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/admin/create' }}
          primaryText={translate('pos.menu.addUser')}
          leftIcon={<RSList.User.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/admin' }}
          primaryText={translate('pos.menu.allUsers')}
          leftIcon={<RSList.User.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        name="notification"
        label={translate('pos.menu.notification')}
        icon={<RSList.Notification.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/notification/create' }}
          primaryText={translate('pos.menu.sendNotification')}
          leftIcon={<RSList.Notification.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/notification' }}
          primaryText={translate('pos.menu.allNotification')}
          leftIcon={<RSList.Notification.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/messages' }}
          primaryText={translate('pos.menu.messagesSettings')}
          leftIcon={<RSList.Notification.icon />}
          dense={dense}
        />
      </SubMenu>
        <SubMenu
        name="campaign"
        label={translate('pos.menu.campaign')}
        icon={<RSList.Campaign.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/campaign/create' }}
          primaryText={translate('pos.menu.createCampaign')}
          leftIcon={<RSList.Campaign.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/campaign' }}
          primaryText={translate('pos.menu.allCampaign')}
          leftIcon={<RSList.Campaign.icon />}
          dense={dense}
        />

      </SubMenu>
        {/*<SubMenu*/}
        {/*name="link"*/}
        {/*label={translate('pos.menu.link')}*/}
        {/*icon={<RSList.Link.icon />}*/}
        {/*dense={dense}>*/}
        {/*<MenuItemLink*/}
          {/*to={{ pathname: '/link/create' }}*/}
          {/*primaryText={translate('pos.menu.createLink')}*/}
          {/*leftIcon={<RSList.Link.createIcon />}*/}
          {/*dense={dense}*/}
        {/*/>*/}
        {/*<MenuItemLink*/}
          {/*to={{ pathname: '/link' }}*/}
          {/*primaryText={translate('pos.menu.allLink')}*/}
          {/*leftIcon={<RSList.Link.icon />}*/}
          {/*dense={dense}*/}
        {/*/>*/}

      {/*</SubMenu>*/}
      <SubMenu
        name="sms"
        label={translate('pos.menu.post')}
        icon={<RSList.Post.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/post/create' }}
          primaryText={translate('pos.menu.createPost')}
          leftIcon={<RSList.Post.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/post' }}
          primaryText={translate('pos.menu.allPost')}
          leftIcon={<RSList.Post.icon />}
          dense={dense}
        />

        <MenuItemLink
          to={{ pathname: '/page/create' }}
          primaryText={translate('pos.menu.createPage')}
          leftIcon={<RSList.Page.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/page' }}
          primaryText={translate('pos.menu.allPage')}
          leftIcon={<RSList.Page.icon />}
          dense={dense}
        />
      </SubMenu>

        {/*<SubMenu*/}
            {/*name="accounting"*/}
            {/*label={translate('pos.menu.accounting')}*/}
            {/*icon={<RSList.Accounting.icon />}*/}
            {/*dense={dense}>*/}
            {/*<MenuItemLink*/}
                {/*to={{ pathname: '/Payments' }}*/}
                {/*primaryText={translate('pos.menu.Payments')}*/}
                {/*leftIcon={<RSList.Accounting.createIcon />}*/}
                {/*dense={dense}*/}
            {/*/>*/}
            {/*<MenuItemLink*/}
                {/*to={{ pathname: '/receipts' }}*/}
                {/*primaryText={translate('pos.menu.Receipts')}*/}
                {/*leftIcon={<RSList.Accounting.createIcon />}*/}
                {/*dense={dense}*/}
            {/*/>*/}
            {/*<MenuItemLink*/}
                {/*to={{ pathname: '/salesInvoice' }}*/}
                {/*primaryText={translate('pos.menu.salesInvoice')}*/}
                {/*leftIcon={<RSList.Accounting.createIcon />}*/}
                {/*dense={dense}*/}
            {/*/>*/}
            {/*<MenuItemLink*/}
                {/*to={{ pathname: '/purchaseInvoice' }}*/}
                {/*primaryText={translate('pos.menu.purchaseInvoice')}*/}
                {/*leftIcon={<RSList.Post.createIcon />}*/}
                {/*dense={dense}*/}
            {/*/>*/}

        {/*</SubMenu>*/}
      <SubMenu
        name="more"
        label={translate('pos.menu.more')}
        icon={<MoreHoriz />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/plugins' }}
          primaryText={translate('pos.menu.plugins')}
          leftIcon={<SettingsInputHdmiIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/template' }}
          primaryText={translate('pos.menu.templates')}
          leftIcon={<RSList.Template.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/action' }}
          primaryText={translate('pos.menu.siteActions')}
          leftIcon={<RSList.Action.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/gateway' }}
          primaryText={translate('pos.menu.allGateways')}
          leftIcon={<RSList.Gateway.icon />}
          dense={dense}
        />

        <MenuItemLink
          to={{ pathname: '/settings' }}
          primaryText={translate('pos.menu.siteSettings')}
          leftIcon={<RSList.Settings.icon />}
          dense={dense}
        />
        {/*<MenuItemLink*/}
          {/*to={{ pathname: '/task' }}*/}
          {/*primaryText={translate('pos.menu.tasks')}*/}
          {/*leftIcon={<RSList.Task.icon />}*/}
          {/*dense={dense}*/}
        {/*/>*/}
        {/*<MenuItemLink*/}
          {/*to={{ pathname: '/note' }}*/}
          {/*primaryText={translate('pos.menu.notes')}*/}
          {/*leftIcon={<RSList.Note.icon />}*/}
          {/*dense={dense}*/}
        {/*/>*/}
        {/*<MenuItemLink*/}
          {/*to={{ pathname: '/automation' }}*/}
          {/*primaryText={translate('pos.menu.automation')}*/}
          {/*leftIcon={<RSList.Automation.icon />}*/}
          {/*dense={dense}*/}
        {/*/>*/}
        {ModelList.map((i, idx) => {
          const modelName = i.toLowerCase();
          if (!ExcludeList.includes(modelName))
            return (
              <MenuItemLink
                key={`${modelName}-${idx}`}
                to={{ pathname: '/' + modelName }}
                primaryText={translate(`pos.menu.${modelName}`)}
                leftIcon={<Dashboard />}
                dense={dense}
                className="vas"
              />
            );

          return null;
        })}
      </SubMenu>
      </>
    )}
    {isSimple && (
      <>
      <MenuItemLink
        to="/"
        primaryText={translate('pos.menu.dashboard')}
        leftIcon={<Dashboard />}
        dense={dense}
        className="vas"
      />
      <SubMenu

      name="sections"
      label={translate('pos.menu.shop')}
      icon={<ShoppingBasketIcon />}
      dense={dense}>
      <SubMenu
        name="product"
        label={translate('pos.menu.products')}
        icon={<RSList.Product.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/product/create' }}
          primaryText={translate('pos.menu.addProduct')}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/product' }}
          primaryText={translate('pos.menu.allProducts')}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        name="sections"
        label={translate('pos.menu.attributes')}
        icon={<RSList.Attributes.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/attributes/create' }}
          primaryText={translate('pos.menu.addAttribute')}
          // leftIcon={<ResourcesList.Attributes.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/attributes' }}
          primaryText={translate('pos.menu.allAttributes')}
          // leftIcon={<ResourcesList.Attributes.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        name="sections"
        label={translate('pos.menu.category')}
        icon={<RSList.ProductCategory.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/productCategory/create' }}
          primaryText={translate('pos.menu.addCategory')}
          // leftIcon={<ResourcesList.ProductCategory.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/productCategory' }}
          primaryText={translate('pos.menu.allCategories')}
          // leftIcon={<ResourcesList.ProductCategory.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        name="order"
        label={translate('pos.menu.orders')}
        icon={<RSList.Order.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/order' }}
          primaryText={translate('pos.menu.allOrders')}
          // leftIcon={<ResourcesList.Order.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/ordercart' }}
          primaryText={translate('pos.menu.cart')}
          // leftIcon={<ResourcesList.OrderCart.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/order/create' }}
          primaryText={translate('pos.menu.addOrder')}
          // leftIcon={<ResourcesList.OrderCart.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        name="transaction"
        label={translate('pos.menu.transactions')}
        icon={<RSList.Transaction.icon />}
        dense={dense}>
        <MenuItemLink
          to={{ pathname: '/transaction/create' }}
          primaryText={translate('pos.menu.addOrderLink')}
          // leftIcon={<ResourcesList.OrderCart.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{ pathname: '/transaction' }}
          primaryText={translate('pos.menu.allTransactions')}
          // leftIcon={<ResourcesList.Transaction.icon/>}
          dense={dense}
        />
      </SubMenu>
    </SubMenu>
    </>
    )}

    </Box>
  );
}
