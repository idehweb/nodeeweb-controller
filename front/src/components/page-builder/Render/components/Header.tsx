import { setStyles } from '@/functions';

export default function Header({ element }) {
  let { type, components, classes, settings } = element;
  let { general } = settings;
  let { fields } = general;
  let { text } = fields;
  let style = setStyles(fields);

  return <div style={style}>{text}</div>;
}
