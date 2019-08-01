#version 330 core

out vec4 fragColor;

uniform float time;
uniform vec2 resolution;

const int MAX_DIST = 64;
float st = sin(time);
float ct = cos(time);
vec4 sphere = vec4(st, abs(st), 6 + ct, 0.5);
vec3 plane = vec3(0, 1, 0);
vec3 light_01 = vec3(0, 5, st*6);

vec4 procedural(vec3 o, vec3 d) {
    float u;
    vec3 p;
    vec3 n = vec3(0, -1, 0);
    vec4 s = sphere;
    float uPlane = -o.y/d.y;

    float a = dot(d, d);
    float b = dot(d, o - s.xyz) * 2;
    float c = dot(s.xyz, s.xyz) + dot(o, o) - 2 * dot(o, s.xyz) - s.w * s.w;

    float x = b*b - 4*a*c;
    if (x >= 0) {
        float u1 = (-b + sqrt(x))/(2*a);
        float u2 = (-b - sqrt(x))/(2*a);
        u = min(u1, u2);
        p = o + u * d;
        n = normalize(p - sphere.xyz);
    }
    else {
        if (uPlane > 0) {
            u = uPlane;
            p = o + u * d;
            n = normalize(plane);
        }
        else
            u = MAX_DIST;
    }
    return vec4(n, u);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.x;
    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    // lighting
    vec4 v = procedural(ro, rd);
    vec3 p = (ro + v.w * rd);
    vec3 l = normalize(light_01 - p);
    float spec = dot(v.xyz, l);
    vec3 color = vec3(spec);

    fragColor = vec4(color, 1.0);
}
