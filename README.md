# 🚀 Sui Token Creator

A comprehensive platform for creating, managing, and deploying tokens on the Sui blockchain with an intuitive interface and powerful management tools.

![Sui Token wizard](https://img.shields.io/badge/Sui-Token%20Creator-teal?style=for-the-badge&logo=sui)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🪙 Token Creation
- **Standard Tokens**: Basic fungible tokens with essential functionality
- **Regulated Tokens**: Advanced tokens with compliance features
- **Closed Loop Tokens**: Policy-controlled tokens with governance and action requests
- **Custom Parameters**: Configurable name, symbol, decimals, and supply
- **Multi-Network Support**: Deploy on Mainnet, Testnet, or Devnet

### 🎨 NFT Creation
- **NFT Collections**: Create and deploy NFT collections with metadata
- **Batch Minting**: Mint multiple NFTs in a single transaction
- **Royalty Management**: Set creator royalties and revenue sharing
- **Metadata Standards**:  integration for decentralized metadata storage
- **Collection Management**: Update collection info, freeze metadata
- **Multi-Network Support**: Deploy on Mainnet, Testnet, or Devnet



### 🛠️ Token Management
- **Mint Tokens**: Create new tokens and distribute to any address
- **Burn Tokens**: Reduce total supply by burning existing tokens
- **Pausable Transfers**: Emergency pause/unpause functionality
- **Denylist Management**: Block/unblock specific addresses
- **Ownership Transfer**: Transfer token control to other addresses

### 🔧 Developer Tools
- **Gas Estimator**: Calculate deployment and transaction costs
- **Blockchain Explorer**: Integrated Sui blockchain explorer

### 📊 Analytics & Monitoring
- **Token Dashboard**: Comprehensive token overview and statistics
- **Transaction History**: Detailed transaction logs and analytics
- **Real-time Updates**: Live blockchain data synchronization
- **Portfolio Tracking**: Multi-token portfolio management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Sui wallet (Sui Wallet, Ethos, or Martian)
- SUI tokens for gas fees

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/sui-token-creator.git
   cd sui-token-creator
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure your environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUI_NETWORK=testnet
   NEXT_PUBLIC_API_URL=https://api.suitokencreator.com
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
sui-token-creator/
├── app/                    # Next.js 14 App Router
│   ├── blog/              # Blog pages and articles
│   ├── docs/              # Documentation pages
│   ├── generate/          # Token creation pages
│   ├── tools/             # Utility tools (explorer, gas estimator)
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── tokenManager/     # Token management components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── styles/               # Global styles and Tailwind config
\`\`\`

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context

### Blockchain Integration
- **Wallet Connection**: @mysten/dapp-kit
- **Sui SDK**: @mysten/sui.js for blockchain interactions
- **Transaction Handling**: Sui Move call integration
- **Network Support**: Mainnet, Testnet, and Devnet
- **Documentation**: Based on official Sui documentation

## 📖 Usage Guide

### Creating Your First Token

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation
   - Select your preferred Sui wallet
   - Approve the connection

2. **Choose Token Type**
   - **Standard**: Basic fungible token
   - **Regulated**: Advanced features (pausable, denylist)
   - **Closed Loop**: Policy-controlled with governance and multi-party approvals

3. **Configure Token**
   \`\`\`typescript
   {
     name: "My Awesome Token",
     symbol: "MAT",
     description: "A token for my awesome project",
     decimals: 9,
     initialSupply: "1000000"
   }
   \`\`\`

4. **Deploy**
   - Review gas estimates
   - Confirm transaction in wallet
   - Wait for blockchain confirmation

### Creating Your First NFT Collection

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation
   - Select your preferred Sui wallet
   - Approve the connection

2. **Navigate to NFT Creation**
   - Go to "Create NFT" section
   - Choose your deployment network

3. **Configure Collection**
   \`\`\`typescript
   {
     name: "My Awesome NFT Collection",
     symbol: "MANC",
     description: "A unique NFT collection for my project",
     maxSupply: 10000,
     royaltyPercentage: 5,
     imagwUri: "https://image/avatars/..."
   }
   \`\`\`

4. **Deploy Collection**
   - Review gas estimates
   - Confirm transaction in wallet
   - Wait for blockchain confirmation

### Managing Tokens

#### Minting New Tokens
\`\`\`typescript
// Mint 1000 tokens to a specific address
await mintTokens({
  amount: "1000",
  recipient: "0x1234...5678"
});
\`\`\`

#### Burning Tokens
\`\`\`typescript
// Burn 500 tokens from supply
await burnTokens({
  amount: "500",
  coinId: "0xabcd...ef01"
});
\`\`\`

#### Pausing Transfers
\`\`\`typescript
// Emergency pause all transfers
await pauseToken();

// Resume transfers
await unpauseToken();
\`\`\`


## 🚀 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy automatically


### Manual Deployment
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support


### Community
- [Discord Server](https://discord.gg/suitokencreator)
- [GitHub Discussions](https://github.com/your-username/sui-token-creator/discussions)
- [Twitter](https://twitter.com/suitokencreator)

### Issues
If you encounter any issues, please [create a GitHub issue](https://github.com/your-username/sui-token-creator/issues/new) with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 🗺️ Roadmap

### Q1 2024
- [ ] Multi-signature wallet support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Governance token templates

### Q2 2024
- [ ] Cross-chain bridge integration
- [ ] DeFi protocol integrations
- [ ] Advanced trading features
- [ ] Enterprise dashboard

### Q3 2024
- [ ] DAO creation tools
- [ ] NFT collection management
- [ ] Staking mechanisms
- [ ] Yield farming integration

## 📊 Statistics

- **Total Tokens Created**: 15,420+
- **Active Users**: 3,421+
- **Total Transactions**: 89,234+
- **Networks Supported**: 3 (Mainnet, Testnet, Devnet)

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) for the amazing blockchain platform
- [Mysten Labs](https://mystenlabs.com/) for development tools
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

<div align="center">
  <p>Made with ❤️ by the Sui Token Creator team</p>
  <p>
    <a href="https://suitokencreator.com">Website</a> •
    <a href="https://docs.suitokencreator.com">Documentation</a> •
    <a href="https://discord.gg/suitokencreator">Discord</a> •
    <a href="https://twitter.com/suitokencreator">Twitter</a>
  </p>
</div>
