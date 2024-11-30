import { useTranslation } from 'react-i18next';
import _truncate from 'lodash/truncate';
import { Link } from 'react-router-dom';

import { MainUrl } from '@/functions';
import { defaultImg } from '@/assets';
import { relativeDate } from '@/functions/dateHelpers';

export default function TestCard({ onClick, item }) {
  const { t } = useTranslation();
  let date = relativeDate(item.updatedAt, t);

  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + '/' + item.photos[0];
  if (item.thumbnail) backgroundImage = MainUrl + '/' + item.thumbnail;
  const url =
    item && item.slug
      ? encodeURIComponent(item.slug.replace(/\\|\//g, ''))
      : item && typeof item.slug === 'string'
      ? item.slug
      : '';
  const title =
    item && item.title && item.title.fa
      ? item.title.fa
      : item && item.title && !item.title.fa
      ? item.title
      : '';

  return (
    <div className="col">
        {/*<div className="card-post__image" onClick={onClick}>*/}
          {/*<Link to={'/post/' + url + '/'}>*/}
            {/*<img*/}
              {/*alt={title}*/}
              {/*loading="lazy"*/}
              {/*src={backgroundImage || defaultImg}*/}
            {/*/>*/}
          {/*</Link>*/}
        {/*</div>*/}


              <Link to={'/test/' + url + '/'} className="col kid-button2">
                <p className={'test-category-level'}>{_truncate(title, { length: 120 })}</p>
              </Link>

            <div className="wer textAlignLeft"></div>

    </div>
  );
}
