import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Text,
    Progress,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink, Flex, Button, AspectRatio
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { modules as academyModules } from "./api/gssocAcademyData";
import Link from "next/link";
// import VideoPlayer from "../components/VideoPlayer";
// import YouTube from "react-youtube";
// import ReactPlayer from 'react-player'

// Mock fetching data from json file
const fetchAcademyData = () => {
    return {
        modules: academyModules,
    };
};

//// Get user progress from localStorage
//// const getUserProgress = () => {
////     if (typeof window !== "undefined") {
////         const modules = localStorage.getItem('academyProgress');
////         return modules ? JSON.parse(modules) : {};
////     }
////     return {};
//// };


const GSSOCAcademy = () => {
    const router = useRouter();
    const { moduleName, video } = router.query;
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    //// const [progress, setProgress] = useState(getUserProgress());

    const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchAcademyData();
            setModules(data.modules);

            if (typeof window !== "undefined") {
                const storedModules = localStorage.getItem('academyModules');
                if (!storedModules) {
                    localStorage.setItem('academyModules', JSON.stringify(data.modules));
                } else {
                    setModules(JSON.parse(storedModules));
                    console.log("modules: ", modules);
                }
            }
        }
        fetchData();
    }, []);

/* ////    useEffect(() => {
   ////     if (typeof window !== "undefined") {
   ////         const storedModules = localStorage.getItem('academyModules');
   ////         if (storedModules) {
   ////             setModules(JSON.parse(storedModules));
   ////             console.log("modules: ", modules);
   ////         }
   ////     }
   //// }, []); */

    
    // Re-fetch or update when query params (moduleName, video) changes
    useEffect(() => {
        if (moduleName && modules?.length > 0) {
            const selectedModule = modules.find(
                (mod) => mod.moduleName === moduleName
            );
            setSelectedModule(selectedModule || null);
            // console.log("vid: ", video);
            if (selectedModule && video) {
                const selectedVideo = selectedModule.videos.find(
                    (vid) => vid.title === video
                );
                setSelectedVideo(selectedVideo || null);
                console.log("selectedVideo: ", selectedVideo);
            } else {
                setSelectedVideo(null);
            }
        } else {
            setSelectedModule(null);
            setSelectedVideo(null);
        }
    }, [moduleName, video, modules]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = resolvedTheme === "dark";
    if (!mounted) return null;
    
    // Mark current video as completed
    const markAsCompleted = (moduleId, videoId) => {
        if (typeof window !== "undefined") {
            const storedModules = JSON.parse(localStorage.getItem('academyModules')) || [];
            
            const updatedModules = storedModules.map((mod) => {
                if (mod.id === moduleId) {
                    mod.videos = mod.videos.map((vid) => {
                        if (vid.id === videoId) {
                            vid.progress = 100; // Mark video as completed
                            vid.completed = true;
                        }
                        return vid;
                    });
                    
                    // Update module progress based on completed videos
                    const completedVideos = mod.videos.filter(vid => vid.progress === 100).length;
                    mod.progress = (completedVideos / mod.videos.length) * 100;
                    mod.progressMessage = `You have completed ${mod.progress.toFixed(1)}% of the module.`;
                    mod.completed = mod.progress === 100;
                }
                return mod;
            });
            
            // Save the updated modules back to localStorage
            localStorage.setItem('academyModules', JSON.stringify(updatedModules));
            setModules(updatedModules);
            handleNextVideo(moduleId, videoId);

            const updatedModule = updatedModules.find(mod => mod.id === moduleId);
            const updatedVideo = updatedModule.videos.find(vid => vid.id === videoId);
            setSelectedVideo(updatedVideo);
        }
    };

    const handleNextVideo = (moduleId, currentVideoId) => {
        const storedModules = JSON.parse(localStorage.getItem('academyModules')) || [];
        const selectedModule = storedModules.find(mod => mod.id === moduleId);
        
        const currentIndex = selectedModule.videos.findIndex(vid => vid.id === currentVideoId);
        const nextVideo = selectedModule.videos[currentIndex + 1];
        
        if (nextVideo) {
            router.push(`/gssoc_academy?moduleName=${encodeURIComponent(selectedModule.moduleName)}&video=${encodeURIComponent(nextVideo.title)}`);
        } else {
            const nextModule = storedModules.find(mod => mod.id === moduleId + 1);
            if (nextModule) {
                router.push(`/gssoc_academy?moduleName=${encodeURIComponent(nextModule.moduleName)}`);
            }
        }
    };
    
    const handlePrevVideo = (moduleId, currentVideoId) => {
        const storedModules = JSON.parse(localStorage.getItem('academyModules')) || [];
        const selectedModule = storedModules.find(mod => mod.id === moduleId);
        
        const currentIndex = selectedModule.videos.findIndex(vid => vid.id === currentVideoId);
        const prevVideo = selectedModule.videos[currentIndex - 1];
        
        if (prevVideo) {
            router.push(`/gssoc_academy?moduleName=${encodeURIComponent(selectedModule.moduleName)}&video=${encodeURIComponent(prevVideo.title)}`);
        } else {
            const prevModule = storedModules.find(mod => mod.id === moduleId - 1);
            if (prevModule) {
                router.push(`/gssoc_academy?moduleName=${encodeURIComponent(prevModule.moduleName)}`);
            }
        }
    };
    

    return (
        <Box p={[4, 6, 8]} maxW="1200px" mx="auto">
            <Heading mb={[4, 6]} size={["lg", "xl"]} color={isDarkMode ? "#fff" : "1a202c"}>GSSOC ACADEMY</Heading>

            {/* Breadcrumb Navigation */}
            <Breadcrumb separator={<ChevronRightIcon color={isDarkMode ? '#fff': 'gray.500'} />} color={isDarkMode ? '#fff': ''} fontSize={["xs", "sm"]}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} href="/gssoc_academy">Home</BreadcrumbLink>
                </BreadcrumbItem>

                {moduleName && (
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link}
                            href={`/gssoc_academy?moduleName=${moduleName}`}
                        >
                            {moduleName}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {video && (
                    <BreadcrumbItem>
                        <BreadcrumbLink as={Link} href="#">{video}</BreadcrumbLink>
                    </BreadcrumbItem>
                )}  
            </Breadcrumb>

            {/* Display all modules if no specific module is selected */}
            {!moduleName && !modules.moduleName && (
                <Box mt={[4, 6]}>
                    {modules.map((module) => (
                        <Box
                            key={module.moduleName}
                            borderWidth="1px"
                            borderRadius="lg"
                            p={[3, 4]}
                            mb={[4, 6]}
                        >
                            <Link
                                href={`/gssoc_academy?moduleName=${module.moduleName}`}
                                passHref
                            >
                                <Heading size="md" cursor="pointer" color={isDarkMode ? "#fff" : "1a202c"}>
                                    {module.moduleName}
                                </Heading>
                            </Link>
                            <Progress
                                value={module.progress}
                                // value={Object.values(module[module.moduleName] || {}).reduce((a, b) => a + b, 0) /
                                // module.videos.length}
                                size="sm"
                                mt={2}
                                className="overflow-hidden rounded-full"
                                colorScheme="orange"
                                max={100}
                                min={0}
                                // aria-valuenow={module.progress}
                            />
                            <Text mt={2} color={isDarkMode ? "#fff" : "1a202c"}>{module.progressMessage}</Text>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Display videos for a selected module */}
            {moduleName && !video && !modules.moduleName && (
                <Box mt={[4, 6]}>
                    <Heading size="lg" mb={[4, 6]} color={isDarkMode ? "#fff" : "1a202c"} >
                        Module: {moduleName}
                    </Heading>
                    {selectedModule?.videos?.length > 0 ? (
                        selectedModule.videos.map((video) => (
                            <Box
                                key={video.title}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={[3, 4]}
                                mb={[4, 6]}
                            >
                                <Link
                                    href={`/gssoc_academy?moduleName=${encodeURIComponent(
                                        moduleName
                                    )}&video=${encodeURIComponent(
                                        video.title
                                    )}`}
                                    passHref
                                >
                                    <Heading size="md" cursor="pointer" color={isDarkMode ? "#fff" : "1a202c"}>
                                        {video.title}
                                    </Heading>
                                </Link>
                                <Text mt={2} color={isDarkMode ? "#fff" : "1a202c"}>{video.description}</Text>
                                <Progress
                                    value={video.progress}
                                    size="sm"
                                    mt={2}
                                    className="overflow-hidden rounded-full"
                                    colorScheme="orange"
                                    max={100}
                                    min={0}
                                    // aria-valuenow={video.progress}
                                />
                            </Box>
                        ))
                    ) : (
                        <Text>No videos available for this module.</Text>
                    )}
                </Box>
            )}

            {/* Display selected video if video is available */}
            {video && (
                <Box mt={[4, 6]}>
                    <Flex justifyContent="space-between" alignItems="center" mb={[4, 6]}>
                        <Heading size="lg" fontSize={["md", "lg", "xl", "2xl"]} color={isDarkMode ? "#fff" : "1a202c"}>
                            {video}
                        </Heading>
                        
                        {/* Mark as Completed Button */}
                        {selectedVideo && (
                            <Button
                            colorScheme="green"
                            // color={isDarkMode ? "#fff" : "1a202c"}
                            onClick={() => markAsCompleted(selectedModule.id, selectedVideo.id)}
                            >
                            {selectedVideo.completed ? "Completed" : "Mark as Completed"}
                            </Button>
                        )}
                    </Flex>
                    {/* <YouTube videoId={selectedVideo?.url.split("/embed/")[1]} /> */}
                    <AspectRatio ratio={16 / 9}>
                        {selectedVideo?.url.includes("loom.com/embed") ? (
                            <iframe
                            src={`${selectedVideo?.url}&hide_share=true&hideEmbedTopBar=true&hide_title=true&hide_owner=true&autoplay=false`}
                            title={selectedVideo?.title}
                            allowFullScreen
                            style={{ border: "none" }}
                            />
                        ) : selectedVideo?.url === "coming soon" ? (
                            <Box textAlign="center" py={8}>
                                <Text fontSize="4xl" fontWeight="bold" color={isDarkMode ? "#fff" : "#1a202c"}>
                                    COMING SOON 🏃‍♂️
                                </Text>
                            </Box>
                        ) : selectedVideo?.url.includes("youtube.com/embed") ? (
                            // YouTube embed with optimized parameters
                            <Box position="relative" w="100%">
                                <iframe
                                    src={`${selectedVideo?.url}&autohide=2&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`}
                                    title={selectedVideo?.title}
                                    allowFullScreen
                                    style={{ border: "none", width: "100%", height: "100%" }}
                                />
                                <Text
                                    fontSize="md"
                                    position="absolute"
                                    bottom="10px"
                                    color="#fff"
                                    backgroundColor="rgba(0, 0, 0, 0.5)"
                                    padding="4px 8px"
                                    borderRadius="md"                     
                                >
                                    Loom Video will be updated soon!
                                </Text>
                            </Box>
                        ) : (
                            // For other URLs or if the video cannot be displayed
                            <Box textAlign="center" py={8}>
                            <Flex justifyContent="center" alignItems="center" direction="column" mb={4}>
                                <Text fontSize="lg" mb={4} color={isDarkMode ? "#fff" : "#1a202c"}>
                                This video cannot be displayed here. Please watch it on YouTube directly:
                                </Text>
                                <Button
                                as="a"
                                href={selectedVideo?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                mt={4}
                                colorScheme="blue"
                                size="md"
                                >
                                Watch on YouTube
                                </Button>
                            </Flex>
                            </Box>
                        )}
                    </AspectRatio>
                        {/* Navigation Buttons */}
                        <Box mt={[4, 6]}>
                            <Flex  justifyContent="space-between" alignItems="center" direction="row" mb={[4,6]}>
                                <Button onClick={() => handlePrevVideo(selectedModule.id, selectedVideo.id)}>
                                    Previous Video
                                </Button>
                                <Button onClick={() => handleNextVideo(selectedModule.id, selectedVideo.id)}>
                                    Next Video
                                </Button>
                            </Flex>
                        </Box>
                    {/* {selectedVideo?.url.includes("youtube.com/embed") ? (
                        <VideoPlayer selectedVideo={selectedVideo} selectedModule={selectedModule} />
                    ) : (
                        <Box textAlign="center" mt={4}>
                        <Text mb={2}>
                            This video cannot be displayed in an iframe. Please watch it on YouTube directly:
                        </Text>
                        <Button as="a" href={selectedVideo?.url} target="_blank" rel="noopener noreferrer">
                            Watch on YouTube
                        </Button>
                    </Box>
                    )} */}

                </Box>
            )}
            {/* Uncomment this to get the UI for the invalid url manipulated by user */}
            {/*  : (
                <Box textAlign="center" 
                    mt={12}
                    p={6}>
                    <Text mb={2} mt={12} className="text-3xl font-bold text-red-600">
                        Invalid URL
                    </Text>
                    <Text mb={6} className="text-lg text-gray-700">
                        The URL you entered is not valid. Please check and try again.
                    </Text>
                    <Link href="/gssoc_academy" _hover={{ textDecoration: 'underline' }}>
                        <Button colorScheme="teal" size="lg" mt={4}>
                            Go Back
                        </Button>
                    </Link>
                </Box>
            )} */}
        </Box>
    );
};

export default GSSOCAcademy;