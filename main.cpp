#include <iostream>
#include <SDL2/SDL.h>
#include <GL/glew.h>
#include <chrono>
#include <iostream>
#include "shader.h"

using namespace std;

GLfloat vertexData[18] = {-1.0f, -1.0f, 0.0f,
                      1.0f, -1.0f, 0.0f,
                      1.0f, 1.0f, 0.0f,
                      -1.0f, -1.0f, 0.0f,
                      -1.0f, 1.0f, 0.0f,
                      1.0f, 1.0f, 0.0f};

int main(int argc, char *argv[], char *envp[])
{
    int width = 1024;
    int height = 1024;

    if (argc == 3) {
        width = atoi(argv[1]);
        height = atoi(argv[2]);
    }
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cout << "Failed to init SDL\n";
        return -1;
    }

    SDL_Window *window = SDL_CreateWindow(
                "Ray Marching",
                SDL_WINDOWPOS_CENTERED,
                SDL_WINDOWPOS_CENTERED,
                width,
                height,
                SDL_WINDOW_OPENGL);
    SDL_GL_SetAttribute(
                SDL_GL_CONTEXT_PROFILE_MASK,
                SDL_GL_CONTEXT_PROFILE_CORE);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);

    SDL_GLContext context = SDL_GL_CreateContext(window);
    glewExperimental = GL_TRUE;
    glewInit();

    // draw stuff
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    SDL_GL_SwapWindow(window);

    // setup a model
    GLuint vao_id, vertexData_id;
    glGenVertexArrays(1, &vao_id);
    glGenBuffers(1, &vertexData_id);

    glBindVertexArray(vao_id);
    glBindBuffer(GL_ARRAY_BUFFER, vertexData_id);
    glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * 18, vertexData, GL_STATIC_DRAW);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    // shader stuff
    Shader *shader = new Shader("../rayMarching01/shader.vert", "../rayMarching01/shader.frag");

    // uniforms
    GLint time_id = glGetUniformLocation(shader->ID, "time");
    GLint resolution_id = glGetUniformLocation(shader->ID, "resolution");

    std::cout << "time: " << time_id << std::endl;
    std::cout << "resolution: " << resolution_id << std::endl;

    GLfloat time = 0;
    GLfloat resolution[2] = {width, height};

    // loop
    bool loop = true;
    while (loop) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT)
                loop = false;
            if (event.type == SDL_KEYDOWN) {
                switch (event.key.keysym.sym) {
                case SDLK_ESCAPE:
                    loop = false;
                    break;
                default:
                    break;
                }
            }
        }

        // time
        time = (1.0f * SDL_GetTicks()) / 1000.0f;
        glUniform1f(time_id, time);
        glUniform2fv(resolution_id, 1, resolution);

        glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glUseProgram(shader->ID);
        glBindVertexArray(vao_id);
        glDrawArrays(GL_TRIANGLES, 0, 18);
        glBindVertexArray(0);

        SDL_GL_SwapWindow(window);
    }


    return 0;
}
