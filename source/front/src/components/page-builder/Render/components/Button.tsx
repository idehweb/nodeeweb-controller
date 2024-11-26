import React , { useCallback } from 'react';
import { Button } from 'shards-react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from "@mui/icons-material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { MainUrl, setStyles, toggleSidebar ,toggleContact} from '#c/functions';
import LazyMuiIcon from '@/components/common/LazyMuiIcon';

import Link from './Link';

export default function TheButton(p) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const { element, conditionStep, handleStep } = p;
  let { classes, settings, handleCard, card } = element;
  let { general } = settings;
  let { fields } = general;
  let {
    text,
    iconFont,
    action,
    iconImage,
    classess,
    showInMobile,
    showInDesktop,
    target,
  } = fields;

  const handleBack = useCallback(() => {
    const { history, location } = window;

    if (history.length <= 2 && location.pathname !== '/') navigate('/');
    else if (location.pathname === '/profile') navigate('/');
    else if (history.length > 2) navigate(-1);
  }, [navigate]);

  let Icon = iconFont ? <span>{<LazyMuiIcon name={iconFont} />}</span> : null;

  const Text = text ? <span>{text}</span> : null;

  if (iconImage)
    Icon = (
      <div className={'mb-2'}>
        <img src={MainUrl + '/' + iconImage} alt={text} loading="lazy" />
      </div>
    );

  let style = setStyles(fields);
  if (conditionStep) {
    return (
      <Button
        onClick={() => handleStep(action)}
        className={clsx(
          'posrel',
          classess,
          showInMobile && 'showInMobile',
          action
        )}
        style={style}>
        {Icon}
        {Text}
      </Button>
    );
  }

  if (action) {
    if (action === 'toggleCart')
      return (
        <Button
          onClick={() => handleCard()}
          className={clsx('posrel', classes, showInMobile && 'showInMobile')}
          style={style}>
          {Icon}
          <span className={'badge'}>{card && card.length}</span>
          {Text}
        </Button>
      );
    else if (action == 'toggleContact') {
      return <Button onClick={() => {
        // console.clear()
        toggleContact();
      }} className={' posrel ' + classess + (showInMobile ? ' showInMobile ' : '')} style={style}>{Icons[iconFont] &&
      <span>{React.createElement(Icons[iconFont])}</span>}<span>{text}</span><span
        className={'arrow-toggle-contact'}><ArrowDropUpIcon/></span></Button>

    }
    else if (action === 'toggleMenu')
      return (
        <Button
          onClick={() => toggleSidebar()}
          className={clsx('posrel', classes, showInMobile && 'showInMobile')}
          style={style}>
          {Icon}
          {Text}
        </Button>
      );
    else if (action === 'back')
      return isHomePage ? null : (
        <Button
          onClick={handleBack}
          className={clsx('posrel', classes, showInMobile && 'showInMobile')}
          style={style}>
          {Icon}
          {Text}
        </Button>
      );
    else
      return (
        <Link
          url={action}
          target={target}
          classes={classess}
          showInMobile={showInMobile}>
          <Button style={style}>
            {Icon}
            {Text}
          </Button>
        </Link>
      );
  } else if (Icon) {
    return (
      <Button
        className={clsx(classess, showInMobile && 'showInMobile')}
        style={style}>
        {Icon}
        {Text}
      </Button>
    );
  }

  return (
    <Button
      className={clsx(classess, showInMobile && 'showInMobile')}
      style={style}>
      {text}
    </Button>
  );
}
