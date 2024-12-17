import { useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {
    Col,
    Row,
    Container,
    Button,
    Card,
    CardHeader,
    Form,
    ListGroup,
    ListGroupItem,
  } from 'shards-react';
import store from '#c/functions/store';
import UserDetails from '#c/components/profile/UserDetails';

import { 
    getSessionInfo, 
    getSessionAmdin, 
    generateSubdomain, 
    getSource, 
    yarnInstall, 
    addEnvLocal, 
    addMongoDb, 
    changeEnvLocal,
    getCDNId,
    saveToCDN,
    runPm2,
    buildConfig,
    httpConfig} from '#c/functions'
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import { useTranslation } from 'react-i18next';
import {Navigate} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { toast } from 'react-toastify';
import { use } from 'i18next';

export default function webSiteBuilder() {
    const [loader, setLoader ]= useState(true)
    const [isDone, setIsDone ]= useState(false)
    const [loaderMessage, setLoaderMessage ]= useState('')
    const [waitingMessage, setWaitingMessage ]= useState('creating Website ...')
    const [goToProfile, setGoToProfile ]= useState(false)
    const [changeText, setChangeText ]= useState(false)
    const [websiteTitle, setWebsiteTitle ]= useState('')
    const [websiteId, setWebsiteId ]= useState('')
    const [resMessage, setResMessage ]= useState('an error occured!')
    const [currentIndex, setCurrentIndex] = useState(0);
    const {t} = useTranslation()
    const [textArray , setTextArray] = useState([t('adding Contents ...'), 
        t('installing Packages ...'), t('adding env local ...'), t('adding env local ...'),
        t('adding db ...'), t('setting up ...'), t('configurating http ...'), t('building Settings ...'),
        t('saving domain in CDN ...')
    ])

 
    const loader2 = (
        <div className="loadNotFound loader" style={{display: 'inline-block'}}>
          <p>{t(waitingMessage)}</p>
          <p> {t(loaderMessage)}</p>
          <LoadingComponent />
        </div>
      );
      useEffect(() => {
        if (!loader) {
            // If an error occurred, set the error message
            return;
          }
      
        const interval = setInterval(() => {
          // Update the waiting message and the current index
          setWaitingMessage(textArray[currentIndex]);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length);
        }, 4000); // 3 seconds interval
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
      }, [textArray, currentIndex]);
    let {user} = store.getState().store;
    console.log(' user : ', user)
    useEffect(() => {
        if(newDomain){
            console.log('new domain recieved: ', newDomain)
            setWebsiteTitle(newDomain);
        }else if (user.webSite && user.webSite.length > 0) {
            console.log('Setting websiteTitle with:', user.webSite[0].title);
            setWebsiteTitle(user.webSite[0].title);
        }
    }, [user.webSite]);
    useEffect(() => {
        if (!websiteTitle) return;
        console.log('get session info from direct admin ...', websiteTitle)
        getSessionInfo().then((res)=> {
            console.log('get sessionId', res)
            if( res.success && res.sessionInfo){
                getSessionAmdin().then((ressession)=>{
                    console.log('ressession aadmin', ressession)
                    if(ressession.success && ressession.sessionInfoAdmin){
                        let sessionIdAdmin = ressession.sessionInfoAdmin.sessionID
                        let sessionId = res.sessionInfo.sessionID
                        console.log('user', user)
                        let obj = {
                            subdomain: websiteTitle,
                            sessionId: sessionId 
                        }
                        generateSubdomain(obj).then((r)=>{
                            if (r.success){
                                // setLoaderMessage(t('domain of your website created!'));
                                // setWaitingMessage(t('adding Contents ...'));
                                let sourceObj = {
                                    title: websiteTitle,
                                    sessionId: sessionId,
                                }
                                getSource(sourceObj).then((res2) => {
                                    console.log('res2', res2)
                                    if(res2.success){
                                        // setLoaderMessage(t('Contents added to Websites!'));
                                        // setWaitingMessage(t('installing Packages ...'));
                                        yarnInstall(websiteTitle).then((res3)=> {
                                            if(res3.success){
                                                // setLoaderMessage(t('Packages installed!'));
                                                // setWaitingMessage(t('adding env local ...'));
                                                addEnvLocal(websiteTitle).then((res4)=>{
                                                    if(res4.success){
                                                        // setLoaderMessage(t('env local is added!'));
                                                        // setWaitingMessage(t('adding db ...'));
                                                        addMongoDb(websiteTitle).then((r5) => {
                                                            if (r5.success){
                                                                // setLoaderMessage(t('db is added!'));
                                                                // setWaitingMessage(t('setting up ...'));
                                                                changeEnvLocal({title: websiteTitle, dbPassword: r5.dbPassword, _id :user._id}).then((r6) => {
                                                                    if(r6.success){
                                                                        // setLoaderMessage(t('setup is done!'));
                                                                        // setWaitingMessage(t('configurating http ...'));
                                                                        let httpObj = {
                                                                            title:websiteTitle,
                                                                            sessionId: sessionIdAdmin
                                                                        }
                                                                        httpConfig(httpObj).then((r7) => {
                                                                            if(r7.success){
                                                                                // setLoaderMessage(t('http config is done!'));
                                                                                // setWaitingMessage(t('building Settings ...'));
                                                                                let objj= {
                                                                                    title: websiteTitle,
                                                                                    sessionId: sessionIdAdmin
                                                                                }
                                                                                buildConfig(objj).then((r8) => {
                                                                                    if(r8.success){
                                                                                        let objjj= {
                                                                                            title: websiteTitle,
                                                                                            customerId: user._id
                                                                                        }
                                                                                        // setLoaderMessage(t('settings is built!'));
                                                                                        // setWaitingMessage(t('saving domain in CDN ...'));
                                                                                        saveToCDN(objjj).then((r10)=>{
                                                                                            if(r10.success){
                                                                                                // setLoaderMessage(t('domain saved in CDN!'));
                                                                                                // setWaitingMessage(t('final process ...'));
                                                                                                runPm2(websiteTitle).then((r11)=>{
                                                                                                    if (r11.success){
                                                                                                        setLoader(false)
                                                                                                        setIsDone(true)
                                                                                                        // setGoToProfile(true)
                                                                                                        // setLoaderMessage(t('your website created!'));
                                                                                                        // setLoaderMessage(t('your website is Online now!'));
                                                                                                    } else {
                                                                                                        setLoader(false)
                                                                                                        setWaitingMessage(r11?.message)
                                                                                                    }
                                                                                                })
                                                                                            } else {
                                                                                                setLoader(false)
                                                                                                setResMessage(r10?.message)
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        setLoader(false)
                                                                                        setResMessage(r8?.message)
                                                                                    }
                                                                                });

                                                                            } else {
                                                                                setLoader(false)
                                                                                setResMessage(r7?.message)
                                                                            }
                                                                        });
        
                                                                    } else {
                                                                        setLoader(false)
                                                                        setResMessage(r6?.message)
                                                                    }
                                                                });
                                                            } else {
                                                                setLoader(false)
                                                                setResMessage(r5?.message)
                                                            }
                                                        })
                                                    } else {
                                                        setLoader(false)
                                                        setResMessage(res4?.message)
                                                    }
                                                })
                                            } else {
                                                setLoader(false)
                                                setResMessage(res3?.message)
                                            }
                                        })   
                                    } else {
                                        setLoader(false)
                                        setResMessage(res2?.message)
                                    }
                                })
                            } else {
                                setLoader(false)
                                setResMessage(r.message)
                            }
                        }).catch((err)=> {
                            console.log('error',err)  
                        });
        
                    } else {
                        setLoader(false)
                        setResMessage(ressession?.message)
                    }
                })
            }else if (!res.success){
                setLoader(false)
                setWaitingMessage(res.message)
            }
        }).catch((err)=> {
            console.log('error', err)
            setLoader(false)
        });
    }, [websiteTitle])

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const newDomain = params.get('newDomain');
    let { hash = 'profile' } = location;
    const [tab, setTab] = useState(() => hash.replace('#', '') || 'profile');
    const token = localStorage.getItem('token')
    if(goToProfile){
        return <Navigate to={'/profile'} />;
    }
    return (
    <Container fluid className="main-content-container px-4 py-5">
        <div className='text-align-center'>
        {loader && <>{loader2}</>}
        </div>
        {(!loader && isDone) && 
        <>
        <div className='text-align-right'>
            <h6>            <a href={`/profile`} target="_self" rel="noopener noreferrer">
                {t('profile')}
            </a></h6>
        </div>
        <div className='text-align-center mb-5'>
            <h5>{t('Congratulations! Your site has been successfully created')}</h5>
        </div>
        <div className='text-align-right'>
        <h6>
            {`${t('your website')}: `}
            <a href={`https://${websiteTitle}.nodeeweb.com`} target="_blank" rel="noopener noreferrer">
                {websiteTitle}.nodeeweb.com
            </a>
        </h6>
        <h6>
            {`${t('your website panel is')}: `}
            <a href={`https://${websiteTitle}.nodeeweb.com/admin`} target="_blank" rel="noopener noreferrer">
                {websiteTitle}.nodeeweb.com/admin
            </a>
        </h6>
        <h6>{`${t('username')}: admin`}</h6>
        <h6>{`${t('password')}: 12345678`}</h6>
        <h6>{t('(Attention! Immediately after entering the admin panel, change your username and password)')}</h6>
        </div></>}
        {(!isDone && !loader) && <div className='text-align-center'>
            <h4>{resMessage}</h4>
            </div>}
    </Container>
    );
}
