import type { ComarkTree } from 'comark'
import type { Component } from 'vue'

export type ContentBody = ComarkTree
export type ContentComponents = Record<string, Component>
export type ContentData = Record<string, unknown>