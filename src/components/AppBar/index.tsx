import { useState } from "react"
import { NavLink, useNavigate, Link } from "react-router-dom"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import * as ROUTES from "../../constants/routes"
import Image from "../General/Image"

//Material-UI
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import AccountCircle from "@mui/icons-material/AccountCircle"
import MenuIcon from "@mui/icons-material/Menu"
import ListItemIcon from "@mui/material/ListItemIcon"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"

//constants
import { routes } from "../../constants/routes"

interface NavMenuButtonProps {
  name: string
  Icon: any
}
const NavMenuButton = ({ name, Icon }: NavMenuButtonProps) => {
  return (
    <Button sx={{ my: 2, color: "white", mr: 2 }} startIcon={<Icon />}>
      {name}
    </Button>
  )
} //, display: "block"

const AppBarNonAuth = () => (
  <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
    {routes.nonAuthRoutes.map((page) => (
      <NavLink to={page.to} key={page.to} style={{ textDecoration: "none" }}>
        <NavMenuButton name={page.name} Icon={page.Icon} />
      </NavLink>
    ))}
  </Box>
)

const AppBarAuth = observer(() => {
  const { userStore, authStore } = useStores()
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  const currentUser = userStore.getCurrentUser()
  const navigate = useNavigate()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleSignOut = () => {
    authStore.doSignOut().then(() => navigate(ROUTES.LANDING))
    handleCloseUserMenu()
  }

  const handleAccountClick = () => {
    navigate(ROUTES.ACCOUNT)
    handleCloseUserMenu()
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <>
      {/* Tablet/Desktop  AppBar */}
      <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
        {routes.authRoutes.map(
          (page, i) =>
            (currentUser?.role === page.role || !page.role) && (
              <NavLink to={page.to} key={i} style={{ textDecoration: "none" }}>
                <NavMenuButton name={page.name} Icon={page.Icon} />
              </NavLink>
            )
        )}
      </Box>
      {/* Mobile AppBar */}
      <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {routes.authRoutes.map(
            (page, i) =>
              (currentUser?.role === page.role || !page.role) && (
                <MenuItem key={i} component={Link} to={page.to} onClick={handleCloseNavMenu}>
                  <ListItemIcon>
                    <page.Icon />
                  </ListItemIcon>
                  <Typography>{page.name}</Typography>
                </MenuItem>
              )
          )}
        </Menu>
      </Box>

      {/* User Icon Menu on right for mobile and desktop*/}
      <Box sx={{ flexGrow: 0 }}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <AccountCircle />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key="1" divider>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <Typography>{currentUser?.getName()}</Typography>
          </MenuItem>
          <MenuItem key="2" divider onClick={handleAccountClick}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <Typography>Account</Typography>
          </MenuItem>
          <MenuItem key="3" onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <Typography>Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  )
})

const ResponsiveAppBar = observer(() => {
  const { authStore } = useStores()
  const isAuth = authStore.isAuthenticated()

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, maxWidth: "50px", display: { xs: "none", md: "flex" } }}>
            <Image fileName="wer_wird_millionar_icon.png" alt={"Logo"} />
          </Typography>

          {isAuth ? <AppBarAuth /> : <AppBarNonAuth />}
        </Toolbar>
      </Container>
    </AppBar>
  )
})

export default ResponsiveAppBar
