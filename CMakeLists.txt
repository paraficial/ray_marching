cmake_minimum_required(VERSION 2.8)

project(raymarching)

find_package(SDL2 REQUIRED)
include_directories(${SDL2_INCLUDE_DIRS})

find_package(GLEW REQUIRED)
include_directories(${GLEW_INCLUDE_DIRS})

find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIRS})

set(SHADERS
    shaders/shader_old.frag
    shaders/shader.frag
    shaders/shader.vert)

set (HEADERS
    shader.h)

set (SOURCES
    main.cpp)


add_executable(${PROJECT_NAME} ${HEADERS} ${SOURCES} ${SHADERS})
target_link_libraries(${PROJECT_NAME} ${SDL2_LIBRARIES} ${GLEW_LIBRARIES} ${OPENGL_LIBRARIES})
