import { Link } from 'react-router-dom';
import '@/styles/study-library.css';
export function LibraryEntry(){return <section className="sl-home-link" aria-label="Personal study plan"><div><strong>Your March 2027 study room</strong><span>Original books, source-linked lessons and kit questions. Planned around work, 07:00–18:00.</span></div><Link to="/study-room">Open your plan →</Link></section>;}
