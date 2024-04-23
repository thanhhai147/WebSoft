import React from 'react'
import { Layout } from 'antd'
import "./styles/footer.component.css"

const { Footer } = Layout

export default function FooterComponent() {
    return (
        <Footer>
            Designed and Created by TeamUIT - version ©{new Date().getFullYear()}
        </Footer>
    )
}