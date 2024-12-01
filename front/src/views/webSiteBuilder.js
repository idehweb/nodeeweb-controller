import { useState , useEffect} from 'react';
import { Col, Container, Nav, NavItem, NavLink, Row } from 'shards-react';
import { useLocation } from 'react-router-dom';
import store from '#c/functions/store';
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
import { toast } from 'react-toastify';

export default function webSiteBuilder() {
    const [loader, setLoader ]= useState(true)
    const [loaderMessage, setLoaderMessage ]= useState('creating Website ...')
    const [goToProfile, setGoToProfile ]= useState(false)
    const [resMessage, setResMessage ]= useState('false')
    const {t} = useTranslation()
    const loader2 = (
        <div className="loadNotFound loader ">
          {t(loaderMessage)}
          <LoadingComponent />
        </div>
      );
    let {user} = store.getState().store;  
    useEffect(() => {
        console.log('get session info from direct admin ...')
        getSessionInfo().then((res)=> {
            console.log('get sessionId', res)
            if( res.success && res.sessionInfo){
                getSessionAmdin().then((ressession)=>{
                    console.log('ressession aadmin', ressession)
                    if(ressession.success && ressession.sessionInfoAdmin){
                        let sessionIdAdmin = ressession.sessionInfoAdmin.sessionID
                        console.log('user', user)
                        let obj = {
                            subdomain: user.webSite,
                            sessionId: res.sessionInfo.sessionID
                        }
                        generateSubdomain(obj).then((r)=>{
                            if (r.success){
                                setLoaderMessage(t('domain of your website created!'));
                                getSource(user.webSite).then((res2) => {
                                    console.log('res2', res2)
                                    if(res2.success){
                                        setLoaderMessage(t('Contents added to Websites!'));
                                        yarnInstall(user.webSite).then((res3)=> {
                                            if(res3.success){
                                                setLoaderMessage(t('Packages installed!'));
                                                addEnvLocal(user.webSite).then((res4)=>{
                                                    if(res4.success){
                                                        setLoaderMessage(t('env local is added!'));
                                                        addMongoDb(user.webSite).then((r5) => {
                                                            if (r5.success){
                                                                setLoaderMessage(t('db is added!'));
                                                                changeEnvLocal({title: user.webSite, dbPassword: r5.dbPassword, _id :user._id}).then((r6) => {
                                                                    if(r6.success){
                                                                        setLoaderMessage(t('setup is done!'));
                                                                        let httpObj = {
                                                                            title:user.webSite,
                                                                            port: r6.customer.port,
                                                                            sessionId: sessionIdAdmin
                                                                        }
                                                                        httpConfig(httpObj).then((r7) => {
                                                                            if(r7.success){
                                                                                setLoaderMessage(t('http config is done!'));
                                                                                let objj= {
                                                                                    title: user.webSite,
                                                                                    sessionId: sessionIdAdmin
                                                                                }
                                                                                buildConfig(objj).then((r8) => {
                                                                                    if(r8.success){
                                                                                        let objjj= {
                                                                                            title: user.webSite,

                                                                                        }
                                                                                        setLoaderMessage(t('settings is built!'));
                                                                                        saveToCDN(objjj).then((r10)=>{
                                                                                            if(r10.success){
                                                                                                setLoaderMessage(t('domain saved in CDN!'));
                                                                                                runPm2(user.webSite).then((r11)=>{
                                                                                                    if (r11.success){
                                                                                                        setLoader(false)
                                                                                                        setGoToProfile(true)
                                                                                                        setLoaderMessage(t('your website created!'));
                                                                                                        setLoaderMessage(t('your website is Online now!'));
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                });

                                                                            }
                                                                        });
        
                                                                    }
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })   
                                    }
                                })
                            } else {
                                setLoader(false)
                                setResMessage(r.message.message)
                            }
                        }).catch((err)=> {
                            console.log('error',err)  
                        });
        
                    }
                })
            }else if (!res.success){
                setLoader(false)
                setResMessage(res.message.message)
            }
        }).catch((err)=> {
            console.log('error', err)
            setLoader(false)
            setResMessage(err)
        });
    }, [])

    const location = useLocation();
    let { hash = 'profile' } = location;
    const [tab, setTab] = useState(() => hash.replace('#', '') || 'profile');
    if(goToProfile){
        return <Navigate to={'/profile'} />;
    }
    return (
    <Container fluid className="main-content-container px-4 py-5">
        {loader && <>{loader2}</>}
        {!loader && <h3 className='text-align-center'>{resMessage}</h3>}
    </Container>
    );
}
