import { useState , useEffect} from 'react';
import { Col, Container, Nav, NavItem, NavLink, Row } from 'shards-react';
import { useLocation } from 'react-router-dom';
import store from '#c/functions/store';
import { getSessionInfo, generateSubdomain, getSource, yarnInstall, addEnvLocal} from '#c/functions'
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import { useTranslation } from 'react-i18next';
import {Navigate} from 'react-router-dom';
import { toast } from 'react-toastify';

export default function webSiteBuilder() {
    const [loader, setLoader ]= useState(true)
    const [goToProfile, setGoToProfile ]= useState(false)
    const [resMessage, setResMessage ]= useState('false')
    const {t} = useTranslation()
    const loader2 = (
        <div className="loadNotFound loader ">
          {t('creating Website ...')}
          <LoadingComponent />
        </div>
      );
    let {user} = store.getState().store;  
    useEffect(() => {
        console.log('get session info from direct admin ...')
        getSessionInfo().then((res)=> {
            console.log('get sessionId', res)
            if( res.success && res.sessionInfo){
                console.log('user', user)
                let obj = {
                    subdomain: user.webSite,
                    sessionId: res.sessionInfo.sessionID
                }
                generateSubdomain(obj).then((r)=>{
                    if (r.success){
                        getSource(user.webSite).then((res2) => {
                            console.log('res2', res2)
                            if(res2.success){
                                toast.success(t('Contents added to Websites!'));
                                yarnInstall(user.webSite).then((res3)=> {
                                    if(res3.success){
                                        toast.success(t('Packages installed!'));
                                        addEnvLocal(user.webSite).then((res4)=>{
                                            if(res4.success){
                                                toast.success(t('setup is done!'));
                                            }
                                            // if(res4){
                                            //     addMongoDb(user.website).then((res5) => {

                                                // })
                                            // }
                                        })
                                    }
                                })   
                            }
                        })
                        setLoader(false)
                        setResMessage(r.message)
                        toast.success(t('your website created!'));
                        setGoToProfile(true)
                    } else {
                        setLoader(false)
                        setResMessage(r.message.message)
                    }
                }).catch((err)=> {
                    console.log('error',err)  
                });
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
    // if(goToProfile){
    //     return <Navigate to={'/profile'} />;
    // }
    return (
    <Container fluid className="main-content-container px-4 py-5">
        {loader && <>{loader2}</>}
        {!loader && <h3 className='text-align-center'>{resMessage}</h3>}
    </Container>
    );
}
